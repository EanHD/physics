import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useModules } from '../hooks/useModules'
import { useProgress } from '../hooks/useProgress'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import { Module, ModuleContent } from '../lib/models/types'
import { getModuleContent } from '../lib/services/ContentService'
import QuizComponent from '../components/QuizComponent'
import ProgressRing from '../components/ProgressRing'

export const ModuleDetailPage = () => {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { modules } = useModules()
  const { progress, updateModuleProgress, completeModule } = useProgress()
  const { isModuleDue, getTimeUntilReview } = useSpacedRepetition()
  
  const [module, setModule] = useState<Module | null>(null)
  const [content, setContent] = useState<ModuleContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [studyStarted, setStudyStarted] = useState(false)

  useEffect(() => {
    if (!moduleId) {
      navigate('/modules')
      return
    }

    const foundModule = modules.find(m => m.id === moduleId)
    if (!foundModule) {
      setError('Module not found')
      setLoading(false)
      return
    }

    setModule(foundModule)
    loadContent(moduleId)
  }, [moduleId, modules, navigate])

  const loadContent = async (id: string) => {
    try {
      setLoading(true)
      const moduleContent = await getModuleContent(id)
      setContent(moduleContent)
      setError(null)
    } catch (err) {
      console.error('Error loading module content:', err)
      setError('Failed to load module content')
    } finally {
      setLoading(false)
    }
  }

  const handleStartStudy = async () => {
    if (!module || !progress) return
    
    setStudyStarted(true)
    await updateModuleProgress(module.id, 'in-progress')
  }

  const handleShowQuiz = () => {
    setShowQuiz(true)
  }

  const handleQuizComplete = async (score: number, _answers: Record<string, string>) => {
    if (!module || !progress) return

    const totalQuestions = content?.quiz?.questions.length || 1
    const percentage = (score / totalQuestions) * 100
    
    // Update module progress with score
    await updateModuleProgress(module.id, 'completed', percentage)

    // Complete module if score is good enough (70%+)
    if (percentage >= 70) {
      await completeModule(module.id)
      setShowQuiz(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className={`h-8 rounded w-64 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className={`h-64 rounded ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !module) {
    return (
      <div className={`min-h-screen transition-colors duration-200 flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Module Not Found</h1>
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {error || 'The requested module could not be found.'}
          </p>
          <button
            onClick={() => navigate('/modules')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Modules
          </button>
        </div>
      </div>
    )
  }

  const moduleState = progress?.module_states[module.id]
  const isCompleted = progress?.completed_modules.includes(module.id)
  const isDue = isModuleDue(module.id)
  const timeUntilReview = getTimeUntilReview(module.id)

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/modules')}
            className={`mb-4 text-blue-500 hover:text-blue-600 flex items-center gap-2 transition-colors`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Modules
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
              <p className={`text-lg mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {module.summary}
              </p>
              
              {/* Module Metadata */}
              <div className="flex flex-wrap gap-4 mb-6">
                {module.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    module.difficulty === 'beginner'
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : module.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {module.difficulty}
                  </span>
                )}
                
                {module.estimated_minutes && (
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    ~{module.estimated_minutes} minutes
                  </span>
                )}

                {module.tags?.map(tag => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'dark' 
                        ? 'bg-blue-800 text-blue-200'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress Card */}
            <div className={`lg:w-80 p-6 rounded-lg shadow-sm ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Progress</h3>
                {moduleState?.score && (
                  <ProgressRing 
                    percentage={moduleState.score} 
                    size={60}
                    color={isCompleted ? '#10b981' : '#3b82f6'}
                  />
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Status
                  </span>
                  <span className={`font-medium ${
                    isCompleted 
                      ? 'text-green-500'
                      : moduleState 
                      ? 'text-blue-500'
                      : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {isCompleted 
                      ? 'Completed' 
                      : moduleState 
                      ? 'In Progress' 
                      : 'Not Started'
                    }
                  </span>
                </div>
                
                {moduleState?.score && (
                  <div className="flex justify-between text-sm">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Best Score
                    </span>
                    <span className="font-medium">
                      {Math.round(moduleState.score)}%
                    </span>
                  </div>
                )}
                
                {moduleState?.attempts && (
                  <div className="flex justify-between text-sm">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Attempts
                    </span>
                    <span className="font-medium">
                      {moduleState.attempts}
                    </span>
                  </div>
                )}

                {isDue && (
                  <div className={`text-sm p-2 rounded ${
                    theme === 'dark' 
                      ? 'bg-blue-800 text-blue-200'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    📅 Due for review
                  </div>
                )}

                {!isDue && timeUntilReview && (
                  <div className="flex justify-between text-sm">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      Next Review
                    </span>
                    <span className="font-medium">
                      {timeUntilReview}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        {module.prerequisites && module.prerequisites.length > 0 && (
          <div className={`mb-8 p-4 rounded-lg ${
            theme === 'dark' 
              ? 'bg-yellow-800 border border-yellow-700 text-yellow-200'
              : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
          }`}>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Prerequisites
            </h3>
            <p className="text-sm">
              Before starting this module, make sure you're familiar with: {module.prerequisites.join(', ')}
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content */}
          <div className="lg:col-span-2">
            {!studyStarted && !isCompleted ? (
              <div className={`p-8 rounded-lg text-center ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <h2 className="text-2xl font-bold mb-4">Ready to Learn?</h2>
                <p className={`mb-6 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Start studying this module to unlock the content and track your progress.
                </p>
                <button
                  onClick={handleStartStudy}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Start Learning
                </button>
              </div>
            ) : showQuiz && content?.quiz ? (
              <QuizComponent
                quiz={content.quiz}
                onComplete={handleQuizComplete}
                onClose={() => setShowQuiz(false)}
              />
            ) : content ? (
              <div className={`p-8 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
                
                {content.quiz && (
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-4">Test Your Knowledge</h3>
                      <p className={`mb-6 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        Complete the quiz to test your understanding and mark this module as complete.
                      </p>
                      <button
                        onClick={handleShowQuiz}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Take Quiz
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`p-8 rounded-lg text-center ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Content not available
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resources */}
            {content?.resources && content.resources.length > 0 && (
              <div className={`p-6 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              }`}>
                <h3 className="font-semibold mb-4">Additional Resources</h3>
                <div className="space-y-3">
                  {content.resources.map(resource => (
                    <a
                      key={resource.id}
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-3 rounded-lg transition-colors ${
                        theme === 'dark'
                          ? 'hover:bg-gray-700 border border-gray-600'
                          : 'hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="font-medium text-blue-500 mb-1">
                        {resource.name}
                      </div>
                      <div className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {resource.description}
                      </div>
                      <div className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {resource.category}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className={`p-6 rounded-lg ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <h3 className="font-semibold mb-4">Quick Navigation</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/modules')}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  ← All Modules
                </button>
                <button
                  onClick={() => navigate('/progress')}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  📊 View Progress
                </button>
                {isDue && (
                  <button
                    onClick={() => navigate('/reviews')}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-blue-300'
                        : 'hover:bg-gray-100 text-blue-700'
                    }`}
                  >
                    📅 Review Mode
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
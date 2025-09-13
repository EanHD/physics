import { useState, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useModules } from '../hooks/useModules'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import { useProgress } from '../hooks/useProgress'
import { Module } from '../lib/models/types'
import { Link } from 'react-router-dom'

export const ReviewsPage = () => {
  const { theme } = useTheme()
  const { modules } = useModules()
  const { dueReviews, recordReview } = useSpacedRepetition()
  const { progress } = useProgress()
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [reviewComplete, setReviewComplete] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    completed: 0,
    excellent: 0,
    good: 0,
    fair: 0,
    poor: 0
  })

  // Get due modules with their details
  const dueModules = dueReviews
    .map(review => modules.find(m => m.id === review.module_id))
    .filter(Boolean) as Module[]

  const currentModule = dueModules[currentReviewIndex]

  useEffect(() => {
    setSessionStats(prev => ({
      ...prev,
      total: dueModules.length
    }))
  }, [dueModules.length])

  const handleReviewRating = async (quality: number) => {
    if (!currentModule) return

    await recordReview({
      module_id: currentModule.id,
      quality,
      timestamp: new Date().toISOString()
    })
    
    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      completed: prev.completed + 1,
      excellent: quality >= 4 ? prev.excellent + 1 : prev.excellent,
      good: quality === 3 ? prev.good + 1 : prev.good,
      fair: quality === 2 ? prev.fair + 1 : prev.fair,
      poor: quality <= 1 ? prev.poor + 1 : prev.poor
    }))

    // Move to next review or complete session
    if (currentReviewIndex < dueModules.length - 1) {
      setCurrentReviewIndex(prev => prev + 1)
    } else {
      setReviewComplete(true)
    }
  }

  const restartSession = () => {
    setCurrentReviewIndex(0)
    setReviewComplete(false)
    setSessionStats({
      total: dueModules.length,
      completed: 0,
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0
    })
  }

  if (dueModules.length === 0) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold mb-4">All Caught Up!</h1>
            <p className={`text-lg mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              You have no modules due for review right now. Great job staying on top of your studies!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <Link
                to="/modules"
                className={`px-6 py-3 rounded-lg font-medium text-center transition-colors ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Study New Modules
              </Link>
              
              <Link
                to="/progress"
                className={`px-6 py-3 rounded-lg font-medium text-center transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300'
                }`}
              >
                View Progress
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (reviewComplete) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">✅</div>
            <h1 className="text-3xl font-bold mb-4">Review Session Complete!</h1>
            <p className={`text-lg mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              You've completed all {sessionStats.total} reviews for today.
            </p>

            {/* Session Stats */}
            <div className={`p-6 rounded-lg mb-8 ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <h2 className="text-xl font-semibold mb-4">Session Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{sessionStats.excellent}</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Excellent
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{sessionStats.good}</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Good
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{sessionStats.fair}</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Fair
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{sessionStats.poor}</div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Needs Work
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Accuracy: {Math.round(((sessionStats.excellent + sessionStats.good) / sessionStats.total) * 100)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={restartSession}
                className={`px-6 py-3 rounded-lg font-medium text-center transition-colors ${
                  theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                Review Again
              </button>
              
              <Link
                to="/modules"
                className={`px-6 py-3 rounded-lg font-medium text-center transition-colors ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Study New Modules
              </Link>
              
              <Link
                to="/progress"
                className={`px-6 py-3 rounded-lg font-medium text-center transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300'
                }`}
              >
                View Progress
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Review Session</h1>
            <div className={`px-4 py-2 rounded-lg ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <span className="text-blue-500 font-medium">
                {currentReviewIndex + 1} of {dueModules.length}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className={`w-full h-2 rounded-full ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentReviewIndex) / dueModules.length) * 100}%` }}
            />
          </div>
        </div>

        {currentModule && (
          <div className="max-w-4xl mx-auto">
            {/* Module Card */}
            <div className={`p-8 rounded-lg mb-8 ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{currentModule.title}</h2>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {currentModule.summary}
                </p>
                
                {currentModule.difficulty && (
                  <span className={`inline-block mt-4 px-3 py-1 rounded-full text-sm font-medium ${
                    currentModule.difficulty === 'beginner'
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : currentModule.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}>
                    {currentModule.difficulty}
                  </span>
                )}
              </div>

              {/* Module State Info */}
              {progress?.module_states[currentModule.id] && (
                <div className={`p-4 rounded-lg mb-6 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border border-gray-600' 
                    : 'bg-gray-100 border border-gray-200'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Status
                      </div>
                      <div className="font-medium text-green-500">Completed</div>
                    </div>
                    {progress.module_states[currentModule.id].score && (
                      <div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Best Score
                        </div>
                        <div className="font-medium">
                          {Math.round(progress.module_states[currentModule.id].score!)}%
                        </div>
                      </div>
                    )}
                    {progress.module_states[currentModule.id].last_accessed && (
                      <div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Last Studied
                        </div>
                        <div className="font-medium">
                          {new Date(progress.module_states[currentModule.id].last_accessed!).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="text-center">
                <Link
                  to={`/modules/${currentModule.id}`}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📖 Review Content (opens in new tab)
                </Link>
              </div>
            </div>

            {/* Review Instructions */}
            <div className={`p-6 rounded-lg mb-8 ${
              theme === 'dark' 
                ? 'bg-blue-800 border border-blue-700 text-blue-100' 
                : 'bg-blue-50 border border-blue-200 text-blue-900'
            }`}>
              <h3 className="font-semibold mb-2">How well do you remember this module?</h3>
              <p className="text-sm opacity-90">
                Rate your recall of the key concepts, formulas, and principles from this module. 
                Be honest - this helps optimize your learning schedule.
              </p>
            </div>

            {/* Rating Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { quality: 5, label: 'Perfect', desc: 'Recalled everything easily', color: 'green' },
                { quality: 4, label: 'Good', desc: 'Recalled most with minor hesitation', color: 'green' },
                { quality: 3, label: 'Fair', desc: 'Recalled with some difficulty', color: 'blue' },
                { quality: 2, label: 'Hard', desc: 'Barely recalled the concepts', color: 'yellow' },
                { quality: 1, label: 'Very Hard', desc: 'Serious difficulty recalling', color: 'red' },
                { quality: 0, label: 'Complete Blackout', desc: 'Could not recall anything', color: 'red' }
              ].map(({ quality, label, desc, color }) => (
                <button
                  key={quality}
                  onClick={() => handleReviewRating(quality)}
                  className={`p-6 rounded-lg border-2 transition-all hover:scale-105 ${
                    color === 'green'
                      ? theme === 'dark'
                        ? 'border-green-600 bg-green-800 hover:bg-green-700 text-green-100'
                        : 'border-green-300 bg-green-50 hover:bg-green-100 text-green-900'
                      : color === 'blue'
                      ? theme === 'dark'
                        ? 'border-blue-600 bg-blue-800 hover:bg-blue-700 text-blue-100'
                        : 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900'
                      : color === 'yellow'
                      ? theme === 'dark'
                        ? 'border-yellow-600 bg-yellow-800 hover:bg-yellow-700 text-yellow-100'
                        : 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100 text-yellow-900'
                      : theme === 'dark'
                        ? 'border-red-600 bg-red-800 hover:bg-red-700 text-red-100'
                        : 'border-red-300 bg-red-50 hover:bg-red-100 text-red-900'
                  }`}
                >
                  <div className="text-2xl font-bold mb-2">{quality}</div>
                  <div className="text-lg font-semibold mb-1">{label}</div>
                  <div className="text-sm opacity-80">{desc}</div>
                </button>
              ))}
            </div>

            {/* Skip Option */}
            <div className="text-center mt-8">
              <button
                onClick={() => handleReviewRating(3)} // Default to fair if skipped
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
                } transition-colors`}
              >
                Skip this review (marks as Fair)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
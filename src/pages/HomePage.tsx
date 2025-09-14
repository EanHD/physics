import { useTheme } from '../hooks/useTheme'
import { useModules } from '../hooks/useModules'
import { useProgress } from '../hooks/useProgress'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import ModuleCard from '../components/ModuleCard'
import ProgressRing from '../components/ProgressRing'
import StudyStreak from '../components/StudyStreak'
import { Link } from 'react-router-dom'

export const HomePage = () => {
  const { theme } = useTheme()
  const { modules, loading: modulesLoading } = useModules()
  const { progress } = useProgress()
  const { dueReviews } = useSpacedRepetition()

  // Handle loading state
  if (!progress) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="text-lg mb-2">Loading progress data...</div>
          <div className="text-sm text-gray-500">Please wait while we initialize your study session</div>
        </div>
      </div>
    )
  }

  // Calculate overall stats
  const totalModules = modules.length
  const completedModules = progress ? modules.filter(m => 
    progress.completed_modules.includes(m.id)
  ).length : 0
  const overallProgress = totalModules > 0 ? completedModules / totalModules : 0

  // Get recently started modules
  const recentModules = progress ? modules
    .filter(m => progress.module_states[m.id]?.last_accessed)
    .sort((a, b) => {
      const aLastStudied = progress.module_states[a.id]?.last_accessed || ''
      const bLastStudied = progress.module_states[b.id]?.last_accessed || ''
      return new Date(bLastStudied).getTime() - new Date(aLastStudied).getTime()
    })
    .slice(0, 3) : []

  // Get recommended modules (not started + some incomplete)
  const recommendedModules = progress ? modules
    .filter(m => !progress.completed_modules.includes(m.id))
    .slice(0, 4) : modules.slice(0, 4)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Quantum Physics
        </h1>
        <p className={`text-xl ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Master quantum mechanics with interactive lessons and spaced repetition
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Progress */}
        <div className={`p-6 rounded-xl shadow-lg ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Overall Progress</h3>
            <ProgressRing percentage={overallProgress * 100} size={60} />
          </div>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {completedModules} of {totalModules} modules completed
          </p>
          <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Study Streak */}
        <div className={`p-6 rounded-xl shadow-lg ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <StudyStreak />
        </div>

        {/* Due Reviews */}
        <div className={`p-6 rounded-xl shadow-lg ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Due Reviews</h3>
            <div className={`text-3xl font-bold ${
              dueReviews.length > 0 ? 'text-orange-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {dueReviews.length}
            </div>
          </div>
          {dueReviews.length > 0 ? (
            <Link
              to="/reviews"
              className="inline-flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium group"
            >
              Review now 
              <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          ) : (
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No reviews due
            </p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/modules"
          className={`group p-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-600' 
              : 'bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400'
          } text-white`}
        >
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold">Browse Modules</h3>
          </div>
          <p className="text-blue-100 group-hover:text-white transition-colors">
            Explore quantum physics concepts from basics to advanced topics
          </p>
        </Link>

        {dueReviews.length > 0 && (
          <Link
            to="/reviews"
            className={`group p-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-orange-800 to-orange-700 hover:from-orange-700 hover:to-orange-600' 
                : 'bg-gradient-to-br from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400'
            } text-white`}
          >
            <div className="flex items-center mb-4">
              <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <h3 className="text-2xl font-bold">Continue Reviews</h3>
            </div>
            <p className="text-orange-100 group-hover:text-white transition-colors">
              {dueReviews.length} module{dueReviews.length !== 1 ? 's' : ''} ready for review
            </p>
          </Link>
        )}
      </div>

      {/* Recent Activity */}
      {recentModules.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Continue Learning</h2>
            <Link
              to="/progress"
              className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center group"
            >
              View all progress 
              <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentModules.map(module => (
              <ModuleCard
                key={module.id}
                module={module}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recommended Modules */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Recommended for You</h2>
          <Link
            to="/modules"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center group"
          >
            View all modules 
            <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        {modulesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`p-6 rounded-xl shadow-lg animate-pulse ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className={`h-6 rounded mb-3 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className={`h-4 rounded mb-2 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className={`h-4 rounded w-2/3 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedModules.map(module => (
              <ModuleCard
                key={module.id}
                module={module}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
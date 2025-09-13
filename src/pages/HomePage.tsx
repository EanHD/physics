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
        <div className="text-lg">Loading...</div>
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
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to Quantum Physics
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Master quantum mechanics with interactive lessons and spaced repetition
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Overall Progress */}
          <div className={`p-6 rounded-lg shadow-sm ${
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
          </div>

          {/* Study Streak */}
          <div className={`p-6 rounded-lg shadow-sm ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <StudyStreak />
          </div>

          {/* Due Reviews */}
          <div className={`p-6 rounded-lg shadow-sm ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Due Reviews</h3>
              <div className={`text-2xl font-bold ${
                dueReviews.length > 0 ? 'text-blue-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {dueReviews.length}
              </div>
            </div>
            {dueReviews.length > 0 ? (
              <Link
                to="/reviews"
                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                Review now →
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/modules"
            className={`p-6 rounded-lg shadow-sm transition-colors ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-700 hover:to-blue-600' 
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400'
            } text-white`}
          >
            <h3 className="text-xl font-semibold mb-2">Browse Modules</h3>
            <p className="opacity-90">
              Explore quantum physics concepts from basics to advanced topics
            </p>
          </Link>

          {dueReviews.length > 0 && (
            <Link
              to="/reviews"
              className={`p-6 rounded-lg shadow-sm transition-colors ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-green-800 to-green-700 hover:from-green-700 hover:to-green-600' 
                  : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400'
              } text-white`}
            >
              <h3 className="text-xl font-semibold mb-2">Continue Reviews</h3>
              <p className="opacity-90">
                {dueReviews.length} module{dueReviews.length !== 1 ? 's' : ''} ready for review
              </p>
            </Link>
          )}
        </div>

        {/* Recent Activity */}
        {recentModules.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Continue Learning</h2>
              <Link
                to="/progress"
                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                View all progress →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recommended for You</h2>
            <Link
              to="/modules"
              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
            >
              View all modules →
            </Link>
          </div>
          {modulesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-lg shadow-sm animate-pulse ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border border-gray-700' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className={`h-4 rounded mb-2 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-3 rounded ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  )
}
import { useTheme } from '../hooks/useTheme'
import { useModules } from '../hooks/useModules'
import { useProgress } from '../hooks/useProgress'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import ProgressRing from '../components/ProgressRing'
import StudyStreak from '../components/StudyStreak'
import ModuleCard from '../components/ModuleCard'
import { Link } from 'react-router-dom'

export const ProgressPage = () => {
  const { theme } = useTheme()
  const { modules } = useModules()
  const { progress, getCompletionStats } = useProgress()
  const { dueReviews } = useSpacedRepetition()

  if (!progress) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-lg">Loading progress...</div>
      </div>
    )
  }

  const stats = getCompletionStats()
  
  // Get modules by status
  const completedModules = modules.filter(m => progress.completed_modules.includes(m.id))
  const inProgressModules = modules.filter(m => 
    progress.module_states[m.id] && !progress.completed_modules.includes(m.id)
  )
  const notStartedModules = modules.filter(m => 
    !progress.module_states[m.id] && !progress.completed_modules.includes(m.id)
  )

  // Get recent activity
  const recentModules = modules
    .filter(m => progress.module_states[m.id]?.last_accessed)
    .sort((a, b) => {
      const aLastAccessed = progress.module_states[a.id]?.last_accessed || ''
      const bLastAccessed = progress.module_states[b.id]?.last_accessed || ''
      return new Date(bLastAccessed).getTime() - new Date(aLastAccessed).getTime()
    })
    .slice(0, 5)

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Track your learning journey through quantum physics
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Overall Progress */}
          <div className={`p-6 rounded-lg shadow-sm ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Overall Progress</h3>
              <ProgressRing percentage={stats.percentage} size={60} />
            </div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {stats.completed} of {modules.length} modules completed
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
                All caught up!
              </p>
            )}
          </div>

          {/* Study Time */}
          <div className={`p-6 rounded-lg shadow-sm ${
            theme === 'dark' 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <h3 className="text-lg font-semibold mb-2">Study Time</h3>
            <div className="text-2xl font-bold text-green-500 mb-1">
              {Math.floor((progress.total_study_time || 0) / 60)}h{' '}
              {(progress.total_study_time || 0) % 60}m
            </div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Total time invested
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        {recentModules.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
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

        {/* Module Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Completed Modules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-green-500">
                Completed ({completedModules.length})
              </h2>
              {completedModules.length > 0 && (
                <ProgressRing percentage={100} size={40} color="#10b981" />
              )}
            </div>
            
            {completedModules.length > 0 ? (
              <div className="space-y-3">
                {completedModules.map(module => {
                  const moduleState = progress.module_states[module.id]
                  return (
                    <div
                      key={module.id}
                      className={`p-4 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Link
                            to={`/modules/${module.id}`}
                            className="font-medium text-green-500 hover:text-green-600"
                          >
                            {module.title}
                          </Link>
                          {moduleState?.score && (
                            <p className={`text-sm mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Score: {Math.round(moduleState.score)}%
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-green-500">✓</div>
                          {moduleState?.last_accessed && (
                            <p className={`text-xs mt-1 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {new Date(moduleState.last_accessed).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className={`text-center py-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p>No completed modules yet</p>
                <Link
                  to="/modules"
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium mt-2 inline-block"
                >
                  Start learning →
                </Link>
              </div>
            )}
          </div>

          {/* In Progress Modules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-500">
                In Progress ({inProgressModules.length})
              </h2>
              {inProgressModules.length > 0 && (
                <div className={`w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin`}></div>
              )}
            </div>
            
            {inProgressModules.length > 0 ? (
              <div className="space-y-3">
                {inProgressModules.map(module => {
                  const moduleState = progress.module_states[module.id]
                  return (
                    <div
                      key={module.id}
                      className={`p-4 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <Link
                            to={`/modules/${module.id}`}
                            className="font-medium text-blue-500 hover:text-blue-600"
                          >
                            {module.title}
                          </Link>
                          {moduleState?.score && (
                            <p className={`text-sm mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Best score: {Math.round(moduleState.score)}%
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-blue-500">📖</div>
                          {moduleState?.last_accessed && (
                            <p className={`text-xs mt-1 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {new Date(moduleState.last_accessed).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className={`text-center py-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p>No modules in progress</p>
              </div>
            )}
          </div>

          {/* Not Started Modules */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-500">
                Not Started ({notStartedModules.length})
              </h2>
            </div>
            
            {notStartedModules.length > 0 ? (
              <div className="space-y-3">
                {notStartedModules.slice(0, 5).map(module => (
                  <div
                    key={module.id}
                    className={`p-4 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Link
                          to={`/modules/${module.id}`}
                          className={`font-medium hover:text-blue-500 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {module.title}
                        </Link>
                        {module.difficulty && (
                          <span className={`ml-2 px-2 py-1 text-xs rounded ${
                            module.difficulty === 'beginner'
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : module.difficulty === 'intermediate'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {module.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="text-gray-400">○</div>
                    </div>
                  </div>
                ))}
                {notStartedModules.length > 5 && (
                  <Link
                    to="/modules"
                    className="block text-center p-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    View all {notStartedModules.length - 5} more →
                  </Link>
                )}
              </div>
            ) : (
              <div className={`text-center py-8 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p>All modules started! 🎉</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/modules"
            className={`px-6 py-3 rounded-lg font-medium text-center transition-colors ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Browse All Modules
          </Link>
          
          {dueReviews.length > 0 && (
            <Link
              to="/reviews"
              className={`px-6 py-3 rounded-lg font-medium text-center transition-colors ${
                theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              Review {dueReviews.length} Module{dueReviews.length !== 1 ? 's' : ''}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
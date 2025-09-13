import { Module } from '../lib/models/types'
import { useTheme } from '../hooks/useTheme'
import { useProgress } from '../hooks/useProgress'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'

interface ModuleCardProps {
  module: Module
  onClick?: () => void
  showProgress?: boolean
}

export default function ModuleCard({ module, onClick, showProgress = true }: ModuleCardProps) {
  const { isDark } = useTheme()
  const { isModuleCompleted, getModuleState } = useProgress()
  const { isModuleDue, getTimeUntilReview } = useSpacedRepetition()

  const isCompleted = isModuleCompleted(module.id)
  const moduleState = getModuleState(module.id)
  const isDue = isModuleDue(module.id)
  const reviewTime = getTimeUntilReview(module.id)

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getStatusColor = () => {
    if (isCompleted) return 'text-green-600 dark:text-green-400'
    if (moduleState?.status === 'in-progress') return 'text-blue-600 dark:text-blue-400'
    return 'text-gray-500 dark:text-gray-400'
  }

  const getStatusIcon = () => {
    if (isCompleted) return '✅'
    if (moduleState?.status === 'in-progress') return '📖'
    return '📄'
  }

  return (
    <div
      className={`relative rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-lg transform hover:-translate-y-1 ${
        isDark
          ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${isCompleted ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
      onClick={onClick}
    >
      {/* Review Badge */}
      {isDue && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Review Due
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon()}</span>
            <h3 className="font-semibold text-lg leading-tight">{module.title}</h3>
          </div>
          
          {/* Difficulty Badge */}
          {module.difficulty && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(module.difficulty)}`}>
              {module.difficulty}
            </span>
          )}
        </div>

        {/* Summary */}
        <p className={`text-sm mb-4 line-clamp-2 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {module.summary}
        </p>

        {/* Tags */}
        {module.tags && module.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {module.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`px-2 py-1 text-xs rounded ${
                  isDark
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                #{tag}
              </span>
            ))}
            {module.tags.length > 3 && (
              <span className={`px-2 py-1 text-xs rounded ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                +{module.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            {/* Estimated Time */}
            {module.estimated_minutes && (
              <span className={`flex items-center space-x-1 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{module.estimated_minutes}min</span>
              </span>
            )}

            {/* Prerequisites */}
            {module.prerequisites && module.prerequisites.length > 0 && (
              <span className={`flex items-center space-x-1 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>{module.prerequisites.length} prereq</span>
              </span>
            )}
          </div>

          {/* Status & Progress */}
          {showProgress && (
            <div className="flex items-center space-x-2">
              {moduleState?.score && (
                <span className={`text-xs font-medium ${getStatusColor()}`}>
                  {Math.round(moduleState.score * 100)}%
                </span>
              )}
              
              <span className={`text-xs ${getStatusColor()}`}>
                {isCompleted ? 'Completed' : moduleState?.status || 'Not Started'}
              </span>

              {reviewTime && (
                <span className={`text-xs ${
                  isDue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {reviewTime}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
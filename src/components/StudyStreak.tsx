import { useTheme } from '../hooks/useTheme'
import { useProgress } from '../hooks/useProgress'

interface StudyStreakProps {
  className?: string
  showDetails?: boolean
}

export default function StudyStreak({ className = '', showDetails = true }: StudyStreakProps) {
  const { isDark } = useTheme()
  const { getStudyStreak, getTotalStudyTime } = useProgress()

  const currentStreak = getStudyStreak()
  const totalMinutes = getTotalStudyTime()

  // Convert minutes to hours and minutes
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return '🆕'
    if (streak < 3) return '🔥'
    if (streak < 7) return '🚀'
    if (streak < 14) return '⭐'
    if (streak < 30) return '💎'
    return '👑'
  }

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return 'Start your learning journey!'
    if (streak === 1) return 'Great start! Keep it up!'
    if (streak < 7) return 'You\'re on fire!'
    if (streak < 14) return 'Impressive consistency!'
    if (streak < 30) return 'You\'re a study superstar!'
    return 'Legendary dedication!'
  }

  return (
    <div className={`${className}`}>
      <div className={`rounded-lg p-4 ${
        isDark
          ? 'bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-800/30'
          : 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <span className="text-2xl">{getStreakEmoji(currentStreak)}</span>
            <span>Study Streak</span>
          </h3>
          
          {showDetails && (
            <div className={`text-sm ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Total: {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
            </div>
          )}
        </div>

        {/* Streak Counter */}
        <div className="text-center mb-2">
          <div className="text-3xl font-bold mb-1">
            {currentStreak}
          </div>
          <div className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {currentStreak === 1 ? 'day' : 'days'}
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className={`text-sm font-medium ${
            isDark ? 'text-orange-300' : 'text-orange-700'
          }`}>
            {getStreakMessage(currentStreak)}
          </p>
        </div>

        {/* Visual streak indicator */}
        {showDetails && currentStreak > 0 && (
          <div className="mt-4">
            <div className="flex justify-center space-x-1">
              {Array.from({ length: Math.min(currentStreak, 7) }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    isDark ? 'bg-orange-400' : 'bg-orange-500'
                  }`}
                />
              ))}
              {currentStreak > 7 && (
                <div className={`px-2 py-1 text-xs rounded-full ${
                  isDark
                    ? 'bg-orange-700 text-orange-200'
                    : 'bg-orange-200 text-orange-800'
                }`}>
                  +{currentStreak - 7}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Motivational tip */}
        {currentStreak > 0 && showDetails && (
          <div className={`mt-3 p-2 rounded text-xs text-center ${
            isDark
              ? 'bg-orange-900/30 text-orange-200'
              : 'bg-orange-100 text-orange-800'
          }`}>
            💡 Study a little each day to maintain your streak!
          </div>
        )}
      </div>
    </div>
  )
}

// Compact version for smaller spaces
export function StudyStreakCompact({ className = '' }: { className?: string }) {
  const { getStudyStreak } = useProgress()
  const currentStreak = getStudyStreak()

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-lg">{currentStreak > 0 ? '🔥' : '🆕'}</span>
      <span className="font-semibold">{currentStreak}</span>
      <span className="text-sm opacity-75">day{currentStreak !== 1 ? 's' : ''}</span>
    </div>
  )
}
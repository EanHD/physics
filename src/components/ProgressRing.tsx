import { useTheme } from '../hooks/useTheme'

interface ProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  showText?: boolean
  className?: string
  color?: string
}

export default function ProgressRing({ 
  percentage, 
  size = 120, 
  strokeWidth = 8, 
  showText = true,
  className = '',
  color
}: ProgressRingProps) {
  const { isDark } = useTheme()

  // Normalize percentage to 0-100
  const normalizedPercentage = Math.min(Math.max(percentage, 0), 100)
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (normalizedPercentage / 100) * circumference

  // Default colors based on theme
  const defaultColor = color || (isDark ? '#3B82F6' : '#2563EB') // blue
  const backgroundColor = isDark ? '#374151' : '#E5E7EB' // gray

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={defaultColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      
      {/* Text content */}
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">
            {Math.round(normalizedPercentage)}%
          </span>
          <span className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Complete
          </span>
        </div>
      )}
    </div>
  )
}

// Preset sizes for common use cases
export const ProgressRingSmall = (props: Omit<ProgressRingProps, 'size' | 'strokeWidth'>) => (
  <ProgressRing {...props} size={60} strokeWidth={6} />
)

export const ProgressRingMedium = (props: Omit<ProgressRingProps, 'size' | 'strokeWidth'>) => (
  <ProgressRing {...props} size={100} strokeWidth={8} />
)

export const ProgressRingLarge = (props: Omit<ProgressRingProps, 'size' | 'strokeWidth'>) => (
  <ProgressRing {...props} size={160} strokeWidth={12} />
)
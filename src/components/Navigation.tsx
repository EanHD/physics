import { useTheme } from '../hooks/useTheme'
import { useProgress } from '../hooks/useProgress'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'
import ThemeToggle from './ThemeToggle'

export default function Navigation() {
  const { theme } = useTheme()
  const { progress } = useProgress()
  const { dueCount } = useSpacedRepetition()

  const navItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Modules', href: '/modules', icon: '📚' },
    { name: 'Progress', href: '/progress', icon: '📊' },
    { name: 'Reviews', href: '/reviews', icon: '🔄', badge: dueCount > 0 ? dueCount : undefined },
    { name: 'Settings', href: '/settings', icon: '⚙️' }
  ]

  const completionPercentage = progress?.completion_percentage || 0

  return (
    <nav className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚛️</div>
            <div>
              <h1 className="text-xl font-bold">Quantum Study</h1>
              <div className="text-xs opacity-75">
                {completionPercentage}% Complete
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </span>
                
                {/* Badge for notifications */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button 
              className={`md:hidden p-2 rounded-md ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pb-2">
          <div className={`w-full bg-gray-200 rounded-full h-1 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-3 gap-2">
            {navItems.slice(0, 6).map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`relative flex flex-col items-center p-2 rounded-md text-xs transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span>{item.name}</span>
                
                {item.badge && (
                  <span className="absolute top-0 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
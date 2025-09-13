import React from 'react'
import { useTheme } from '../hooks/useTheme'
import Navigation from './Navigation'
import OfflineIndicator from './OfflineIndicator'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-900'
    }`}>
      {/* Navigation */}
      <Navigation />
      
      {/* Offline Indicator */}
      <OfflineIndicator />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {children}
      </main>
      
      {/* Footer */}
      <footer className={`mt-auto py-6 border-t ${
        theme === 'dark' 
          ? 'border-gray-700 bg-gray-800' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="container mx-auto px-4 text-center text-sm">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Quantum Mechanics Study App - Built with React, Vite & Tailwind CSS
          </p>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Spaced repetition powered by the SM-2 algorithm
          </p>
        </div>
      </footer>
    </div>
  )
}
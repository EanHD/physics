import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { exportProgress, importProgress } from '../lib/services/ProgressService'

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme()
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [message, setMessage] = useState('')

  const handleExport = async () => {
    try {
      setExporting(true)
      setMessage('')
      
      const data = await exportProgress()
      
      // Create and trigger download
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quantum-physics-progress-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setMessage('Progress exported successfully!')
    } catch (error) {
      setMessage('Failed to export progress. Please try again.')
      console.error('Export error:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setImporting(true)
      setMessage('')
      
      const text = await file.text()
      await importProgress(text)
      
      setMessage('Progress imported successfully! Please refresh the page.')
    } catch (error) {
      setMessage('Failed to import progress. Please check the file format.')
      console.error('Import error:', error)
    } finally {
      setImporting(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const handleInstallApp = () => {
    setMessage('To install this app: Click the install button in your browser address bar, or use "Add to Home Screen" from your browser menu.')
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Customize your learning experience
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Failed') || message.includes('error')
              ? theme === 'dark'
                ? 'bg-red-900 border border-red-700 text-red-300'
                : 'bg-red-50 border border-red-200 text-red-700'
              : theme === 'dark'
                ? 'bg-green-900 border border-green-700 text-green-300'
                : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Appearance */}
        <div className={`mb-8 p-6 rounded-lg shadow-sm ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Theme</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Choose your preferred color scheme
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className={`mb-8 p-6 rounded-lg shadow-sm ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-xl font-semibold mb-4">Data Management</h2>
          
          <div className="space-y-4">
            {/* Export Progress */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Export Progress</h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Download your progress as a backup file
                </p>
              </div>
              <button
                onClick={handleExport}
                disabled={exporting}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  exporting
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {exporting ? 'Exporting...' : 'Export'}
              </button>
            </div>

            {/* Import Progress */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Import Progress</h3>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Restore your progress from a backup file
                </p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={importing}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <button
                  disabled={importing}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    importing
                      ? theme === 'dark'
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {importing ? 'Importing...' : 'Import'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* App Installation */}
        <div className={`mb-8 p-6 rounded-lg shadow-sm ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-xl font-semibold mb-4">App Installation</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Install as App</h3>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Install this app on your device for quick access
              </p>
            </div>
            <button
              onClick={handleInstallApp}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Install
            </button>
          </div>
        </div>

        {/* About */}
        <div className={`p-6 rounded-lg shadow-sm ${
          theme === 'dark' 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className="text-xl font-semibold mb-4">About</h2>
          
          <div className="space-y-2 text-sm">
            <p><strong>App Version:</strong> 1.0.0</p>
            <p><strong>Learning Algorithm:</strong> SM-2 Spaced Repetition</p>
            <p><strong>Offline Support:</strong> Yes</p>
            <p><strong>Data Storage:</strong> Local (IndexedDB)</p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Built with React, TypeScript, and modern web technologies.
              Your data is stored locally and never sent to external servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
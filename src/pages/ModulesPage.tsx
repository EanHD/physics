import { useState, useMemo } from 'react'
import { useTheme } from '../hooks/useTheme'
import { useModules } from '../hooks/useModules'
import { useProgress } from '../hooks/useProgress'
import ModuleCard from '../components/ModuleCard'

export const ModulesPage = () => {
  const { theme } = useTheme()
  const { modules, loading } = useModules()
  const { progress } = useProgress()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all')
  const [sortBy, setSortBy] = useState<'title' | 'difficulty' | 'progress'>('title')

  // Filter and sort modules
  const filteredAndSortedModules = useMemo(() => {
    let filtered = modules.filter(module => {
      // Search filter
      const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           module.summary.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (!matchesSearch) return false

      // Status filter
      if (filterStatus === 'all') return true
      
      if (!progress) return filterStatus === 'not-started'
      
      const moduleState = progress.module_states[module.id]
      const isCompleted = progress.completed_modules.includes(module.id)
      
      switch (filterStatus) {
        case 'completed':
          return isCompleted
        case 'in-progress':
          return moduleState && !isCompleted
        case 'not-started':
          return !moduleState && !isCompleted
        default:
          return true
      }
    })

    // Sort modules
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
          const aDiff = a.difficulty || 'beginner'
          const bDiff = b.difficulty || 'beginner'
          return difficultyOrder[aDiff] - difficultyOrder[bDiff]
        case 'progress':
          if (!progress) return 0
          const aCompleted = progress.completed_modules.includes(a.id)
          const bCompleted = progress.completed_modules.includes(b.id)
          const aInProgress = progress.module_states[a.id] && !aCompleted
          const bInProgress = progress.module_states[b.id] && !bCompleted
          
          // Sort: in-progress first, then not-started, then completed
          if (aInProgress && !bInProgress) return -1
          if (!aInProgress && bInProgress) return 1
          if (aCompleted && !bCompleted) return 1
          if (!aCompleted && bCompleted) return -1
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [modules, searchQuery, filterStatus, sortBy, progress])

  // Get stats for filters
  const stats = useMemo(() => {
    if (!progress) {
      return {
        total: modules.length,
        notStarted: modules.length,
        inProgress: 0,
        completed: 0
      }
    }

    const completed = modules.filter(m => progress.completed_modules.includes(m.id)).length
    const inProgress = modules.filter(m => 
      progress.module_states[m.id] && !progress.completed_modules.includes(m.id)
    ).length
    const notStarted = modules.length - completed - inProgress

    return {
      total: modules.length,
      notStarted,
      inProgress,
      completed
    }
  }, [modules, progress])

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className={`h-8 rounded w-64 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className={`h-12 rounded ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-lg h-48 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                ></div>
              ))}
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
          <h1 className="text-3xl font-bold mb-2">Quantum Physics Modules</h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Explore {modules.length} interactive lessons covering quantum mechanics
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 pr-10 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            />
            <div className={`absolute right-3 top-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Filter by Status
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'all', label: `All (${stats.total})` },
                  { key: 'not-started', label: `Not Started (${stats.notStarted})` },
                  { key: 'in-progress', label: `In Progress (${stats.inProgress})` },
                  { key: 'completed', label: `Completed (${stats.completed})` }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilterStatus(key as any)}
                    className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                      filterStatus === key
                        ? 'bg-blue-500 text-white'
                        : theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex-1">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              >
                <option value="title">Title (A-Z)</option>
                <option value="difficulty">Difficulty</option>
                <option value="progress">Progress</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Showing {filteredAndSortedModules.length} of {modules.length} modules
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Modules Grid */}
        {filteredAndSortedModules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedModules.map(module => (
              <ModuleCard
                key={module.id}
                module={module}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.469.899-6.062 2.371L12 21l6.062-3.629A7.962 7.962 0 0012 15z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">No modules found</h3>
            <p className="mb-4">
              {searchQuery 
                ? `No modules match "${searchQuery}"`
                : 'No modules match the selected filters'
              }
            </p>
            {(searchQuery || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setFilterStatus('all')
                }}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
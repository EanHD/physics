import { useState, useEffect } from 'react'
import { getAllModules, getModuleContent } from '../lib/services/ContentService'
import { Module, ModuleContent } from '../lib/models/types'

export function useModules() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true)
        setError(null)
        const allModules = getAllModules()
        setModules(allModules)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load modules')
      } finally {
        setLoading(false)
      }
    }

    loadModules()
  }, [])

  const getModulesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    return modules.filter(module => module.difficulty === difficulty)
  }

  const getModulesByTag = (tag: string) => {
    return modules.filter(module => module.tags?.includes(tag))
  }

  const searchModules = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return modules.filter(module => 
      module.title.toLowerCase().includes(lowercaseQuery) ||
      module.summary.toLowerCase().includes(lowercaseQuery) ||
      module.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  const getModuleById = (id: string) => {
    return modules.find(module => module.id === id)
  }

  return {
    modules,
    loading,
    error,
    getModulesByDifficulty,
    getModulesByTag,
    searchModules,
    getModuleById,
    totalModules: modules.length
  }
}

export function useModuleContent(moduleId: string | null) {
  const [content, setContent] = useState<ModuleContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!moduleId) {
      setContent(null)
      return
    }

    const loadContent = async () => {
      try {
        setLoading(true)
        setError(null)
        const moduleContent = await getModuleContent(moduleId)
        setContent(moduleContent)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load module content')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [moduleId])

  return {
    content,
    loading,
    error,
    hasQuiz: content?.quiz !== null && content?.quiz !== undefined,
    hasResources: (content?.resources?.length || 0) > 0
  }
}
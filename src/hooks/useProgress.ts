import { useState, useEffect, useCallback } from 'react'
import { getProgress, updateProgress, canAccessModule } from '../lib/services/ProgressService'
import { UserProgress, ModuleState } from '../lib/models/types'

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProgress = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const userProgress = await getProgress()
      setProgress(userProgress)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  const updateModuleProgress = useCallback(async (
    moduleId: string,
    status: ModuleState['status'],
    score?: number
  ) => {
    try {
      const result = await updateProgress({
        module_id: moduleId,
        status,
        score
      })

      if (result.ok) {
        // Reload progress to get updated state
        await loadProgress()
        return true
      }
      return false
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress')
      return false
    }
  }, [loadProgress])

  const startModule = useCallback((moduleId: string) => {
    return updateModuleProgress(moduleId, 'in-progress')
  }, [updateModuleProgress])

  const completeModule = useCallback((moduleId: string, score?: number) => {
    return updateModuleProgress(moduleId, 'completed', score)
  }, [updateModuleProgress])

  const isModuleCompleted = useCallback((moduleId: string) => {
    return progress?.completed_modules.includes(moduleId) || false
  }, [progress])

  const getModuleState = useCallback((moduleId: string): ModuleState | null => {
    return progress?.module_states[moduleId] || null
  }, [progress])

  const isModuleAccessible = useCallback(async (moduleId: string) => {
    try {
      return await canAccessModule(moduleId)
    } catch {
      return false
    }
  }, [])

  const getCompletionStats = useCallback(() => {
    if (!progress) return { completed: 0, total: 0, percentage: 0 }
    
    const completed = progress.completed_modules.length
    const total = Object.keys(progress.module_states).length || 1
    const percentage = (completed / total) * 100

    return {
      completed,
      total,
      percentage: Math.round(percentage)
    }
  }, [progress])

  const getStudyStreak = useCallback(() => {
    return progress?.study_streak || 0
  }, [progress])

  const getTotalStudyTime = useCallback(() => {
    return progress?.total_study_time || 0
  }, [progress])

  return {
    progress,
    loading,
    error,
    updateModuleProgress,
    startModule,
    completeModule,
    isModuleCompleted,
    getModuleState,
    isModuleAccessible,
    getCompletionStats,
    getStudyStreak,
    getTotalStudyTime,
    reload: loadProgress
  }
}
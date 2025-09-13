import { useState, useEffect, useCallback } from 'react'
import { SpacedRepetitionService, ReviewResult } from '../lib/services/SpacedRepetitionService'
import { ReviewItem } from '../lib/models/types'

export function useSpacedRepetition() {
  const [dueReviews, setDueReviews] = useState<ReviewItem[]>([])
  const [upcomingReviews, setUpcomingReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [due, upcoming] = await Promise.all([
        SpacedRepetitionService.getDueReviews(),
        SpacedRepetitionService.getUpcomingReviews(7) // Next 7 days
      ])
      
      setDueReviews(due)
      setUpcomingReviews(upcoming)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const scheduleReview = useCallback(async (moduleId: string, completionScore: number) => {
    try {
      await SpacedRepetitionService.scheduleModuleReview(moduleId, completionScore)
      await loadReviews() // Refresh the review lists
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule review')
      return false
    }
  }, [loadReviews])

  const recordReview = useCallback(async (result: ReviewResult) => {
    try {
      await SpacedRepetitionService.recordReview(result)
      await loadReviews() // Refresh the review lists
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record review')
      return false
    }
  }, [loadReviews])

  const getReviewStats = useCallback(async () => {
    try {
      return await SpacedRepetitionService.getReviewStats()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get review stats')
      return {
        total_reviews: 0,
        due_today: 0,
        due_this_week: 0,
        average_ease_factor: 2.5,
        retention_rate: 1
      }
    }
  }, [])

  const resetModuleReview = useCallback(async (moduleId: string) => {
    try {
      await SpacedRepetitionService.resetModuleReview(moduleId)
      await loadReviews()
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset module review')
      return false
    }
  }, [loadReviews])

  // Helper to check if a module is due for review
  const isModuleDue = useCallback((moduleId: string) => {
    return dueReviews.some(review => review.module_id === moduleId)
  }, [dueReviews])

  // Get next review date for a module
  const getNextReviewDate = useCallback((moduleId: string) => {
    const review = [...dueReviews, ...upcomingReviews].find(r => r.module_id === moduleId)
    return review ? new Date(review.next_review) : null
  }, [dueReviews, upcomingReviews])

  // Get time until next review
  const getTimeUntilReview = useCallback((moduleId: string) => {
    const nextDate = getNextReviewDate(moduleId)
    if (!nextDate) return null
    
    const now = new Date()
    const diffMs = nextDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 0) return 'Due now'
    if (diffDays === 1) return 'Due tomorrow'
    return `Due in ${diffDays} days`
  }, [getNextReviewDate])

  return {
    dueReviews,
    upcomingReviews,
    loading,
    error,
    scheduleReview,
    recordReview,
    getReviewStats,
    resetModuleReview,
    isModuleDue,
    getNextReviewDate,
    getTimeUntilReview,
    reload: loadReviews,
    hasDueReviews: dueReviews.length > 0,
    dueCount: dueReviews.length,
    upcomingCount: upcomingReviews.length
  }
}
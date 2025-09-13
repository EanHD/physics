import { ReviewItem } from '../models/types'
import { StorageService } from './StorageService'

// SM-2 (SuperMemo 2) algorithm implementation for spaced repetition
// Based on the algorithm developed by Piotr Wozniak

export interface ReviewResult {
  module_id: string
  quality: number // 0-5 scale (0-2: failure, 3-5: success)
  timestamp: string
}

export interface ScheduledReview extends ReviewItem {
  repetition: number
}

export class SpacedRepetitionService {
  // Quality grades for SM-2 algorithm
  static readonly QUALITY_GRADES = {
    COMPLETE_BLACKOUT: 0,
    INCORRECT_HARD: 1,
    INCORRECT_EASY: 2,
    CORRECT_HARD: 3,
    CORRECT_HESITANT: 4,
    CORRECT_EASY: 5
  } as const

  // Default ease factor (2.5 is the SM-2 default)
  static readonly DEFAULT_EASE_FACTOR = 2.5
  static readonly MIN_EASE_FACTOR = 1.3

  /**
   * Calculate the next review date and ease factor based on SM-2 algorithm
   */
  static calculateNextReview(
    currentItem: ScheduledReview | null,
    quality: number
  ): ScheduledReview {
    // Initialize for new items
    if (!currentItem) {
      return {
        module_id: '',
        next_review: new Date().toISOString(),
        interval_days: 1,
        ease_factor: this.DEFAULT_EASE_FACTOR,
        repetition: 0
      }
    }

    let { ease_factor = this.DEFAULT_EASE_FACTOR, repetition = 0 } = currentItem
    let interval_days = 1

    // SM-2 Algorithm implementation
    if (quality >= 3) {
      // Correct response
      switch (repetition) {
        case 0:
          interval_days = 1
          break
        case 1:
          interval_days = 6
          break
        default:
          interval_days = Math.round(currentItem.interval_days * ease_factor)
          break
      }
      repetition += 1
    } else {
      // Incorrect response - start over
      repetition = 0
      interval_days = 1
    }

    // Update ease factor
    ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    
    // Ensure ease factor doesn't go below minimum
    if (ease_factor < this.MIN_EASE_FACTOR) {
      ease_factor = this.MIN_EASE_FACTOR
    }

    // Calculate next review date
    const next_review = new Date()
    next_review.setDate(next_review.getDate() + interval_days)

    return {
      module_id: currentItem.module_id,
      next_review: next_review.toISOString(),
      interval_days,
      ease_factor,
      repetition
    }
  }

  /**
   * Schedule a module for review based on completion score
   */
  static async scheduleModuleReview(
    moduleId: string,
    completionScore: number,
    _timestamp: string = new Date().toISOString()
  ): Promise<void> {
    try {
      // Convert completion score (0-1) to quality grade (0-5)
      const quality = this.scoreToQuality(completionScore)

      // Get existing review item or create new one
      const reviews = await StorageService.getReviewItems()
      const existingReview = reviews.find(r => r.module_id === moduleId) as ScheduledReview | undefined

      // Calculate next review using SM-2
      const nextReview = this.calculateNextReview(existingReview || null, quality)
      nextReview.module_id = moduleId

      // Update reviews array
      const updatedReviews = reviews.filter(r => r.module_id !== moduleId)
      updatedReviews.push(nextReview)

      // Save to storage
      await StorageService.saveReviewItems(updatedReviews)
    } catch (error) {
      console.error('Failed to schedule module review:', error)
      throw error
    }
  }

  /**
   * Get modules due for review today
   */
  static async getDueReviews(): Promise<ReviewItem[]> {
    try {
      const reviews = await StorageService.getReviewItems()
      const now = new Date()
      
      return reviews.filter(review => {
        const reviewDate = new Date(review.next_review)
        return reviewDate <= now
      })
    } catch (error) {
      console.error('Failed to get due reviews:', error)
      return []
    }
  }

  /**
   * Get upcoming reviews for the next N days
   */
  static async getUpcomingReviews(days: number = 7): Promise<ReviewItem[]> {
    try {
      const reviews = await StorageService.getReviewItems()
      const now = new Date()
      const future = new Date()
      future.setDate(future.getDate() + days)
      
      return reviews.filter(review => {
        const reviewDate = new Date(review.next_review)
        return reviewDate > now && reviewDate <= future
      }).sort((a, b) => 
        new Date(a.next_review).getTime() - new Date(b.next_review).getTime()
      )
    } catch (error) {
      console.error('Failed to get upcoming reviews:', error)
      return []
    }
  }

  /**
   * Record a review session and update the schedule
   */
  static async recordReview(result: ReviewResult): Promise<void> {
    try {
      const reviews = await StorageService.getReviewItems()
      const existingReview = reviews.find(r => r.module_id === result.module_id) as ScheduledReview | undefined

      // Calculate next review
      const nextReview = this.calculateNextReview(existingReview || null, result.quality)
      nextReview.module_id = result.module_id

      // Update reviews array
      const updatedReviews = reviews.filter(r => r.module_id !== result.module_id)
      updatedReviews.push(nextReview)

      // Save to storage
      await StorageService.saveReviewItems(updatedReviews)
    } catch (error) {
      console.error('Failed to record review:', error)
      throw error
    }
  }

  /**
   * Convert completion score (0-1) to SM-2 quality grade (0-5)
   */
  private static scoreToQuality(score: number): number {
    if (score >= 0.9) return this.QUALITY_GRADES.CORRECT_EASY
    if (score >= 0.8) return this.QUALITY_GRADES.CORRECT_HESITANT
    if (score >= 0.6) return this.QUALITY_GRADES.CORRECT_HARD
    if (score >= 0.4) return this.QUALITY_GRADES.INCORRECT_EASY
    if (score >= 0.2) return this.QUALITY_GRADES.INCORRECT_HARD
    return this.QUALITY_GRADES.COMPLETE_BLACKOUT
  }

  /**
   * Get statistics about the review system
   */
  static async getReviewStats(): Promise<{
    total_reviews: number
    due_today: number
    due_this_week: number
    average_ease_factor: number
    retention_rate: number
  }> {
    try {
      const reviews = await StorageService.getReviewItems()
      const dueToday = await this.getDueReviews()
      const dueThisWeek = await this.getUpcomingReviews(7)

      const totalReviews = reviews.length
      const averageEaseFactor = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + (r.ease_factor || this.DEFAULT_EASE_FACTOR), 0) / reviews.length
        : this.DEFAULT_EASE_FACTOR

      // Simple retention rate calculation (modules with ease factor >= default)
      const retainedModules = reviews.filter(r => (r.ease_factor || this.DEFAULT_EASE_FACTOR) >= this.DEFAULT_EASE_FACTOR)
      const retentionRate = totalReviews > 0 ? retainedModules.length / totalReviews : 1

      return {
        total_reviews: totalReviews,
        due_today: dueToday.length,
        due_this_week: dueThisWeek.length,
        average_ease_factor: Number(averageEaseFactor.toFixed(2)),
        retention_rate: Number(retentionRate.toFixed(2))
      }
    } catch (error) {
      console.error('Failed to get review stats:', error)
      return {
        total_reviews: 0,
        due_today: 0,
        due_this_week: 0,
        average_ease_factor: this.DEFAULT_EASE_FACTOR,
        retention_rate: 1
      }
    }
  }

  /**
   * Reset the review schedule for a module (useful for debugging or manual reset)
   */
  static async resetModuleReview(moduleId: string): Promise<void> {
    try {
      const reviews = await StorageService.getReviewItems()
      const updatedReviews = reviews.filter(r => r.module_id !== moduleId)
      await StorageService.saveReviewItems(updatedReviews)
    } catch (error) {
      console.error('Failed to reset module review:', error)
      throw error
    }
  }
}
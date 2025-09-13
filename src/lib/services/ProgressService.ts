import { UserProgress, ReviewItem } from '../models/types'
import { getAllModules } from './ContentService'
import { StorageService } from './StorageService'
import { SpacedRepetitionService } from './SpacedRepetitionService'

export async function getProgress(): Promise<UserProgress> {
  try {
    const progress = await StorageService.getUserProgress()
    
    // Calculate completion percentage if not present
    if (progress.completion_percentage === undefined) {
      const modules = getAllModules()
      progress.completion_percentage = modules.length > 0 ? progress.completed_modules.length / modules.length : 0
      await StorageService.saveUserProgress(progress)
    }
    
    return progress
  } catch (error) {
    console.error('Failed to get progress:', error)
    // Fallback to default progress
    return {
      user_id: null,
      completed_modules: [],
      module_states: {},
      completion_percentage: 0
    }
  }
}

export async function updateProgress(update: {
  module_id: string
  status?: 'not-started' | 'in-progress' | 'completed'
  score?: number
}): Promise<{ ok: boolean }> {
  try {
    const progress = await getProgress()
    
    if (update.module_id) {
      if (!progress.module_states) progress.module_states = {}
      
      const existingState = progress.module_states[update.module_id] || {}
      progress.module_states[update.module_id] = {
        status: update.status || 'in-progress',
        last_accessed: new Date().toISOString(),
        score: update.score || existingState.score || null,
        attempts: (existingState.attempts || 0) + 1
      }
      
      // Add to completed modules if completed and not already there
      if (update.status === 'completed' && !progress.completed_modules.includes(update.module_id)) {
        progress.completed_modules.push(update.module_id)
        
        // Schedule for spaced repetition if completed with a score
        if (update.score !== undefined) {
          await SpacedRepetitionService.scheduleModuleReview(update.module_id, update.score)
        }
      }
      
      // Update completion percentage
      const modules = getAllModules()
      progress.completion_percentage = modules.length > 0 ? progress.completed_modules.length / modules.length : 0
    }
    
    await StorageService.saveUserProgress(progress)
    return { ok: true }
  } catch (error) {
    console.error('Failed to update progress:', error)
    return { ok: false }
  }
}

export async function canAccessModule(moduleId: string): Promise<boolean> {
  const modules = getAllModules()
  const module = modules.find(m => m.id === moduleId)
  
  if (!module || !module.prerequisites || module.prerequisites.length === 0) {
    return true // No prerequisites, can access
  }
  
  const progress = await getProgress()
  return module.prerequisites.every(prereq => 
    progress.completed_modules.includes(prereq)
  )
}

// Legacy sync version for backward compatibility with tests
export function canAccessModuleSync(moduleId: string): boolean {
  const modules = getAllModules()
  const module = modules.find(m => m.id === moduleId)
  
  if (!module || !module.prerequisites || module.prerequisites.length === 0) {
    return true // No prerequisites, can access
  }
  
  // For sync version, we can't check real progress
  // This is a limitation for legacy compatibility
  return false // Default to false for modules with prerequisites
}

export function getRecommendedModules(): Array<{ module_id: string; reason?: string }> {
  const modules = getAllModules()
  // Note: This should be async to get real progress, but keeping sync for compatibility
  const recommendations = []
  
  // Recommend first few modules for now
  for (const module of modules.slice(0, 3)) {
    recommendations.push({
      module_id: module.id,
      reason: 'Good starting point'
    })
  }
  
  return recommendations
}

export async function getDueReviews(): Promise<ReviewItem[]> {
  return await SpacedRepetitionService.getDueReviews()
}

// Legacy sync version for backward compatibility
export function getDueReviewsSync(): ReviewItem[] {
  // Return empty array for sync version
  return []
}

// Export/Import functionality
export async function exportProgress(): Promise<string> {
  try {
    const progress = await getProgress()
    const reviewItems = await SpacedRepetitionService.getDueReviews()
    
    const exportData = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      progress,
      review_items: reviewItems,
      modules_info: getAllModules().map(m => ({ id: m.id, title: m.title }))
    }
    
    return JSON.stringify(exportData, null, 2)
  } catch (error) {
    console.error('Failed to export progress:', error)
    throw new Error('Failed to export progress data')
  }
}

export async function importProgress(jsonData: string): Promise<void> {
  try {
    const importData = JSON.parse(jsonData)
    
    // Validate import data structure
    if (!importData.version || !importData.progress) {
      throw new Error('Invalid import data format')
    }
    
    // Import progress
    await StorageService.saveUserProgress(importData.progress)
    
    // Import review items if available
    if (importData.review_items && Array.isArray(importData.review_items)) {
      for (const item of importData.review_items) {
        await SpacedRepetitionService.scheduleModuleReview(item.module_id, 3, item.ease_factor)
      }
    }
    
    console.log('Progress imported successfully')
  } catch (error) {
    console.error('Failed to import progress:', error)
    throw new Error('Failed to import progress data. Please check the file format.')
  }
}

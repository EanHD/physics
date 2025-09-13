import { describe, it, expect, beforeEach } from 'vitest'
import { StorageService } from '../../src/lib/services/StorageService'
import fs from 'fs'
import path from 'path'

// Integration test: Cross-module learning path
// Tests prerequisites, dependencies, and learning flow between modules

describe('Integration: Learning Path Navigation', () => {
  const testProgressFile = path.join(process.cwd(), 'content', 'progress.json')
  
  beforeEach(async () => {
    // Clean up test progress file completely
    try {
      if (fs.existsSync(testProgressFile)) {
        fs.unlinkSync(testProgressFile)
      }
    } catch {
      // Ignore if file doesn't exist
    }
    
    // Also clear storage service data
    try {
      await StorageService.clearAllData()
    } catch {
      // Ignore errors in test cleanup
    }
    
    // Force initialize empty progress
    const emptyProgress = {
      user_id: null,
      completed_modules: [],
      module_states: {},
      study_streak: 0,
      total_study_time: 0,
      completion_percentage: 0
    }
    await StorageService.saveUserProgress(emptyProgress)
  })

  it('enforces module prerequisites', async () => {
    // Test that users can't access advanced modules without prerequisites
    const { getAllModules } = await import('../../src/lib/services/ContentService')
    const { canAccessModuleSync } = await import('../../src/lib/services/ProgressService')
    
    const modules = getAllModules()
    const advancedModule = modules.find(m => m.prerequisites && m.prerequisites.length > 0)
    
    if (advancedModule) {
      // With no progress, shouldn't be able to access advanced modules
      const canAccess = canAccessModuleSync(advancedModule.id)
      expect(canAccess).toBe(false)
      
      // TODO: Test with prerequisite completion
    } else {
      // If no modules with prerequisites found, we'll test the logic works
      // by verifying modules without prerequisites are accessible
      const simpleModule = modules[0] // Take first module (should have no prereqs)
      if (simpleModule) {
        const canAccess = canAccessModuleSync(simpleModule.id)
        expect(canAccess).toBe(true) // Should be accessible
      }
    }
  })

  it('suggests next modules based on current progress', async () => {
    // Test that the app recommends appropriate next modules
    const { getRecommendedModules } = await import('../../src/lib/services/ProgressService')
    const { getAllModules } = await import('../../src/lib/services/ContentService')
    
    const allModules = getAllModules()
    const recommended = getRecommendedModules()
    
    expect(Array.isArray(recommended)).toBe(true)
    expect(recommended.length).toBeGreaterThan(0)
    
    // Recommended modules should exist in the module list
    for (const rec of recommended) {
      const exists = allModules.some(m => m.id === rec.module_id)
      expect(exists).toBe(true)
    }
  })

  it('tracks learning path completion', async () => {
    // Test overall learning path progress
    const { getProgress } = await import('../../src/lib/services/ProgressService')
    const { getAllModules } = await import('../../src/lib/services/ContentService')
    
    const progress = await getProgress()
    const modules = getAllModules()
    
    // Calculate completion percentage
    const completedCount = progress.completed_modules.length
    const totalCount = modules.length
    const completionPercentage = totalCount > 0 ? completedCount / totalCount : 0
    
    expect(completionPercentage).toBeGreaterThanOrEqual(0)
    expect(completionPercentage).toBeLessThanOrEqual(1)
    
    // Progress should include completion percentage
    expect(progress.completion_percentage).toBeDefined()
  })

  it('handles circular dependencies gracefully', async () => {
    // Test that circular prerequisites don't break the system
    const { getAllModules } = await import('../../src/lib/services/ContentService')
    
    const modules = getAllModules()
    
    // Build dependency graph and check for cycles
    const hasCircularDependency = (moduleId: string, visited = new Set<string>()): boolean => {
      if (visited.has(moduleId)) return true
      
      visited.add(moduleId)
      const module = modules.find(m => m.id === moduleId)
      if (!module || !module.prerequisites) return false
      
      for (const prereq of module.prerequisites) {
        if (hasCircularDependency(prereq, new Set(visited))) {
          return true
        }
      }
      
      return false
    }
    
    // Check each module for circular dependencies
    for (const module of modules) {
      const hasCircular = hasCircularDependency(module.id)
      expect(hasCircular).toBe(false)
    }
  })

  it('provides module difficulty progression', async () => {
    // Test that modules have appropriate difficulty levels
    const { getAllModules } = await import('../../src/lib/services/ContentService')
    
    const modules = getAllModules()
    
    for (const module of modules) {
      // Each module should have a difficulty level
      expect(module.difficulty).toBeDefined()
      expect(['beginner', 'intermediate', 'advanced']).toContain(module.difficulty)
      
      // If module has prerequisites, it should generally be harder than them
      if (module.prerequisites && module.prerequisites.length > 0) {
        const prereqModules = modules.filter(m => module.prerequisites!.includes(m.id))
        
        for (const prereq of prereqModules) {
          // This is a soft rule - advanced modules can depend on beginner modules
          // But we check that the dependency makes sense
          const difficultyOrder = ['beginner', 'intermediate', 'advanced']
          const moduleIndex = difficultyOrder.indexOf(module.difficulty || 'beginner')
          const prereqIndex = difficultyOrder.indexOf(prereq.difficulty || 'beginner')
          
          // Prerequisite should not be harder than dependent module
          expect(prereqIndex).toBeLessThanOrEqual(moduleIndex)
        }
      }
    }
  })

  it('supports multiple learning paths', async () => {
    // Test that users can follow different learning tracks
    const { getAllModules } = await import('../../src/lib/services/ContentService')
    
    const modules = getAllModules()
    
    // Modules should have tags that allow for different paths
    const allTags = new Set<string>()
    for (const module of modules) {
      if (module.tags) {
        module.tags.forEach(tag => allTags.add(tag))
      }
    }
    
    expect(allTags.size).toBeGreaterThan(0)
    
    // Should have at least a few different topic areas
    const topicTags = Array.from(allTags).filter(tag => 
      !['beginner', 'intermediate', 'advanced', 'hands-on', 'theoretical'].includes(tag)
    )
    
    expect(topicTags.length).toBeGreaterThan(1)
  })
})
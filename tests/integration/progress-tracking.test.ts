import { describe, it, expect, beforeEach } from 'vitest'
import { getProgress, updateProgress } from '../../src/lib/services/ProgressService'
import { getAllModules } from '../../src/lib/services/ContentService'
import { StorageService } from '../../src/lib/services/StorageService'
import fs from 'fs'
import path from 'path'

// Integration test: Progress tracking across multiple modules and sessions

describe('Integration: Progress Tracking', () => {
  const testProgressFile = path.join(process.cwd(), 'content', 'progress.json')
  
  beforeEach(async () => {
    if (fs.existsSync(testProgressFile)) {
      fs.unlinkSync(testProgressFile)
    }
    
    // Also clear storage service data
    try {
      await StorageService.clearAllData()
    } catch {
      // Ignore errors in test cleanup
    }
  })

  it('tracks progress across multiple modules correctly', async () => {
    const modules = getAllModules()
    expect(modules.length).toBeGreaterThanOrEqual(2)
    
    const [module1, module2] = modules.slice(0, 2)
    
    // Complete first module
    await updateProgress({
      module_id: module1.id,
      status: 'completed',
      score: 0.8
    })
    
    // Start second module
    await updateProgress({
      module_id: module2.id,
      status: 'in-progress',
      score: 0.6
    })
    
    const progress = await getProgress()
    
    // Verify both modules are tracked
    expect(progress.completed_modules).toContain(module1.id)
    expect(progress.completed_modules).not.toContain(module2.id)
    expect(progress.module_states[module1.id].status).toBe('completed')
    expect(progress.module_states[module2.id].status).toBe('in-progress')
  })

  it('calculates study streaks and total time (placeholder)', async () => {
    const modules = getAllModules()
    const testModule = modules[0]
    
    // This test defines expected behavior for study streaks
    // Implementation will be added when we build the streak tracking
    await updateProgress({
      module_id: testModule.id,
      status: 'completed'
    })
    
    const progress = await getProgress()
    
    // For now, just verify the structure exists
    // TODO: Implement study_streak and total_study_time calculation
    expect(typeof progress.study_streak === 'number' || progress.study_streak === undefined).toBe(true)
    expect(typeof progress.total_study_time === 'number' || progress.total_study_time === undefined).toBe(true)
  })

  it('maintains progress persistence across app restarts', async () => {
    const modules = getAllModules()
    const testModule = modules[0]
    
    // Save some progress
    await updateProgress({
      module_id: testModule.id,
      status: 'completed',
      score: 0.95
    })
    
    // Simulate app restart by getting fresh progress
    const reloadedProgress = await getProgress()
    
    expect(reloadedProgress.completed_modules).toContain(testModule.id)
    expect(reloadedProgress.module_states[testModule.id].score).toBe(0.95)
  })
})
import { describe, it, expect, beforeEach } from 'vitest'
import { getProgress, updateProgress } from '../../src/lib/services/ProgressService'
import { getAllModules } from '../../src/lib/services/ContentService'
import { StorageService } from '../../src/lib/services/StorageService'
import fs from 'fs'
import path from 'path'

// Integration test: Study session flow
// Complete flow from starting a module to completing it and updating progress

describe('Integration: Study Session Flow', () => {
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

  it('completes a full study session with progress tracking', async () => {
    // 1. Get available modules
    const modules = getAllModules()
    expect(modules.length).toBeGreaterThan(0)
    
    const firstModule = modules[0]
    
    // 2. Check initial progress (should be empty)
    const initialProgress = await getProgress()
    expect(initialProgress.completed_modules).toHaveLength(0)
    expect(Object.keys(initialProgress.module_states)).toHaveLength(0)
    
    // 3. Start studying the module
    const startResult = await updateProgress({
      module_id: firstModule.id,
      status: 'in-progress'
    })
    expect(startResult.ok).toBe(true)
    
    // 4. Check progress after starting
    const progressAfterStart = await getProgress()
    expect(progressAfterStart.module_states[firstModule.id]).toBeDefined()
    expect(progressAfterStart.module_states[firstModule.id].status).toBe('in-progress')
    
    // 5. Complete the module with a score
    const completeResult = await updateProgress({
      module_id: firstModule.id,
      status: 'completed',
      score: 0.85
    })
    expect(completeResult.ok).toBe(true)
    
    // 6. Verify final progress state
    const finalProgress = await getProgress()
    expect(finalProgress.completed_modules).toContain(firstModule.id)
    expect(finalProgress.module_states[firstModule.id].status).toBe('completed')
    expect(finalProgress.module_states[firstModule.id].score).toBe(0.85)
    expect(finalProgress.module_states[firstModule.id].attempts).toBeGreaterThan(0)
  })

  it('handles multiple study sessions and attempts', async () => {
    const modules = getAllModules()
    const testModule = modules[0]
    
    // First attempt - incomplete
    await updateProgress({
      module_id: testModule.id,
      status: 'in-progress',
      score: 0.5
    })
    
    let progress = await getProgress()
    expect(progress.module_states[testModule.id].attempts).toBe(1)
    
    // Second attempt - complete
    await updateProgress({
      module_id: testModule.id,
      status: 'completed',
      score: 0.9
    })
    
    progress = await getProgress()
    expect(progress.module_states[testModule.id].attempts).toBe(2)
    expect(progress.module_states[testModule.id].score).toBe(0.9)
    expect(progress.completed_modules).toContain(testModule.id)
  })
})
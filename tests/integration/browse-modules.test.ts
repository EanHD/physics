import { describe, it, expect } from 'vitest'
import { getAllModules, getModuleContent } from '../../src/lib/services/ContentService'

// Integration test: Browse modules flow (service layer)
// Tests the complete flow of discovering and loading module content

describe('Integration: Browse Modules Flow', () => {
  it('can load and filter modules by difficulty', async () => {
    const modules = getAllModules()
    
    expect(Array.isArray(modules)).toBe(true)
    expect(modules.length).toBeGreaterThan(0)
    
    // Should have modules with different difficulties
    const beginnerModules = modules.filter(m => m.difficulty === 'beginner')
    const advancedModules = modules.filter(m => m.difficulty === 'advanced')
    
    expect(beginnerModules.length).toBeGreaterThan(0)
    expect(advancedModules.length).toBeGreaterThan(0)
  })

  it('can navigate from module list to module detail', async () => {
    const modules = getAllModules()
    expect(modules.length).toBeGreaterThan(0)
    
    const firstModule = modules[0]
    const moduleContent = getModuleContent(firstModule.id)
    
    expect(moduleContent).not.toBeNull()
    expect(moduleContent?.id).toBe(firstModule.id)
    expect(moduleContent?.content.length).toBeGreaterThan(0)
  })

  it('handles prerequisite chain navigation', async () => {
    const modules = getAllModules()
    const modulesWithPrereqs = modules.filter(m => m.prerequisites && m.prerequisites.length > 0)
    
    if (modulesWithPrereqs.length > 0) {
      const moduleWithPrereq = modulesWithPrereqs[0]
      const prereqId = moduleWithPrereq.prerequisites![0]
      const prereqModule = modules.find(m => m.id === prereqId)
      
      expect(prereqModule).toBeDefined()
      expect(prereqModule?.id).toBe(prereqId)
    }
  })
})
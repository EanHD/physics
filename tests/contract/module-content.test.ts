import { describe, it, expect } from 'vitest'
import { getModuleContent } from '../../src/lib/services/ContentService'

describe('Contract: GET /api/modules/{id}', () => {
  it('returns module content with id, content, quiz, resources', async () => {
    const moduleId = '01-calculus'
    const response = getModuleContent(moduleId)

    expect(response).not.toBeNull()
    if (response) {
      expect(typeof response.id).toBe('string')
      expect(typeof response.content).toBe('string')
      expect(typeof response.quiz === 'object' || response.quiz === null).toBe(true)
      expect(Array.isArray(response.resources)).toBe(true)
    }
  })
})
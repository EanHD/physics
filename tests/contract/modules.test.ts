import { describe, it, expect } from 'vitest'
import { getAllModules } from '../../src/lib/services/ContentService'

describe('Contract: GET /api/modules', () => {
  it('returns an array of modules with required fields', async () => {
    const response = getAllModules()

    // Expectations per contract
    expect(Array.isArray(response)).toBe(true)
    if (Array.isArray(response) && response.length > 0) {
      const module = response[0]
      expect(typeof module.id).toBe('string')
      expect(typeof module.title).toBe('string')
      expect(typeof module.summary).toBe('string')
    }
  })
})
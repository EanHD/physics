import { describe, it, expect } from 'vitest'
import { getProgress } from '../../src/lib/services/ProgressService'

describe('Contract: GET /api/progress', () => {
  it('returns user progress object with completed_modules and module_states', async () => {
    const response = await getProgress()

    expect(response).not.toBeNull()
    expect(Array.isArray(response.completed_modules)).toBe(true)
    expect(typeof response.module_states === 'object').toBe(true)
  })
})
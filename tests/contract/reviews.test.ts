import { describe, it, expect } from 'vitest'
import { getDueReviews } from '../../src/lib/services/ProgressService'

describe('Contract: GET /api/reviews', () => {
  it('returns an array of review items with module_id and next_review', async () => {
    const response = await getDueReviews()

    expect(Array.isArray(response)).toBe(true)
    if (Array.isArray(response) && response.length > 0) {
      const item = response[0]
      expect(typeof item.module_id).toBe('string')
      expect(typeof item.next_review).toBe('string')
    }
  })
})
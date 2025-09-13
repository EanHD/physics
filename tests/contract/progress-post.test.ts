import { describe, it, expect } from 'vitest'
import { updateProgress } from '../../src/lib/services/ProgressService'

describe('Contract: POST /api/progress', () => {
  it('accepts a progress update payload and returns success', async () => {
    const payload = {
      module_id: '01-calculus',
      status: 'completed' as const,
      score: 0.9
    }
    const response = await updateProgress(payload)

    expect(response).not.toBeNull()
    // Response shape may be minimal for MVP - e.g., {ok:true}
    const ok = (response as any).ok === true || (response as any).updated === true
    expect(ok).toBe(true)
  })
})
import {describe, expect, it} from 'vitest'
import {doRectsIntersect} from './geometry.ts'

describe('doRectsIntersect', () => {
    it('returns true with intersecting', () => {
        expect(doRectsIntersect({
            w: 5,
            h: 5,
            x: 4,
            y: 10,
        }, {
            w: 5,
            h: 5,
            x: 3,
            y: 10,
        })).toBe(true)
    })
    it('returns false without intersecting', () => {
        expect(doRectsIntersect({
            w: 2,
            h: 2,
            x: 4,
            y: 4,
        }, {
            w: 2,
            h: 2,
            x: 8,
            y: 8,
        })).toBe(false)
    })
})

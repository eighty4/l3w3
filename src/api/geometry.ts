export interface Point {
    x: number
    y: number
}

export interface Size {
    w: number
    h: number
}

export type Rect = Point & Size

export function doRectsIntersect(r1: Rect, r2: Rect): boolean {
    const r1x2 = r1.x + r1.w
    const r1y2 = r1.y + r1.h
    const r2x2 = r2.x + r2.w
    const r2y2 = r2.y + r2.h
    return r1x2 > r2.x && r1.x < r2x2 && r1y2 > r2.y && r1.y < r2y2
}

export function getRectCenter(rect: Rect): Point {
    return {
        x: rect.x + (rect.w / 2),
        y: rect.y + (rect.h / 2),
    }
}

export function moveRectTowardsPoint(rect: Rect, point: Point, distance: number): void {
    const center = getRectCenter(rect)
    const angle = Math.atan2(point.y - center.y, point.x - center.x)
    rect.y += Math.sin(angle) * distance
    rect.x += Math.cos(angle) * distance
}

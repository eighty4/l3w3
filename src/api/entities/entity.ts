import type {DrawContext} from '../drawing.ts'
import type {Rect, Size} from '../geometry.ts'

export interface Entity {
    draw(drawing: DrawContext): void

    get rect(): Rect

    update(elapsedTime: number, canvasSize: Size): void
}

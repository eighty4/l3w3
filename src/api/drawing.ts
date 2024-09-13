export type CanvasSize = { w: number, h: number }

export class DrawContext {
    readonly #canvas: HTMLCanvasElement
    readonly #canvasCtx: CanvasRenderingContext2D

    constructor(canvas: HTMLCanvasElement) {
        this.#canvas = canvas
        this.#canvasCtx = canvas.getContext('2d') as CanvasRenderingContext2D
        window.addEventListener('resize', this.#calcCoordinateScaling)
        this.#calcCoordinateScaling()
    }

    clear() {
        this.#canvasCtx.reset()
    }

    drawRect(color: string, x: number, y: number, w: number, h: number) {
        this.#canvasCtx.fillStyle = color
        this.#canvasCtx.fillRect(x, y, w, h)
    }

    get canvasSize(): CanvasSize {
        return {w: this.width, h: this.height}
    }

    get ctx(): CanvasRenderingContext2D {
        return this.#canvasCtx
    }

    get width(): number {
        return this.#canvas.width
    }

    get height(): number {
        return this.#canvas.height
    }

    #calcCoordinateScaling = () => {
        this.#canvasCtx.reset()
        const clientRect = this.#canvas.getBoundingClientRect()
        this.#canvas.width = clientRect.width
        this.#canvas.height = clientRect.height
    }
}

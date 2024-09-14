import type {Rect, Size} from './geometry.ts'

const IMG_URL_BASE = import.meta.env.BASE_URL === '/' ? '/img/' : import.meta.env.BASE_URL + '/img/'

export class ImageResource {
    static lambda(): CanvasImageSource {
        return this.#loadImage('lambda.png')
    }

    static playerCharacter(): CanvasImageSource {
        return this.#loadImage('player_character.png')
    }

    static #loadImage(subpath: string): CanvasImageSource {
        const img = new Image() as HTMLImageElement
        img.src = IMG_URL_BASE + subpath
        return img
    }
}

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

    drawImage(img: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, d: Rect) {
        this.#canvasCtx.drawImage(img, sx, sy, sw, sh, d.x, d.y, d.w, d.h)
    }

    drawRect(color: string, d: Rect) {
        this.#canvasCtx.fillStyle = color
        this.#canvasCtx.fillRect(d.x, d.y, d.w, d.h)
    }

    get size(): Size {
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

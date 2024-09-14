import {type DrawContext, ImageResource} from '../drawing.ts'
import {doRectsIntersect, getRectCenter, moveRectTowardsPoint, type Rect, type Size} from '../geometry.ts'
import type {GameObserver} from '../game.ts'
import type {Entity} from './entity.ts'
import type {Player} from './player.ts'

const SPEED_PPS = 10

export class Monster implements Entity {
    readonly #img: CanvasImageSource = ImageResource.playerCharacter()
    readonly #obs: GameObserver
    readonly #player: Player
    readonly #rect: Rect = {
        x: 0,
        y: 0,
        w: 60,
        h: 120,
    }

    constructor(canvasSize: Size, player: Player, obs: GameObserver) {
        this.#obs = obs
        this.#player = player
        this.#rect.x = canvasSize.w - (canvasSize.w / 6) - (this.#rect.w / 2)
        this.#rect.y = (canvasSize.h / 2) - (this.#rect.h / 2)
    }

    draw(drawing: DrawContext): void {
        drawing.ctx.drawImage(this.#img, 10 * 17, 0, 15, 24, this.#rect.x, this.#rect.y, this.#rect.w, this.#rect.h)
    }

    get rect(): Rect {
        return this.#rect
    }

    update(elapsedTime: number, _canvasSize: Size): void {
        moveRectTowardsPoint(this.#rect, getRectCenter(this.#player.rect), SPEED_PPS / (elapsedTime * .1))
        if (doRectsIntersect(this.#rect, this.#player.rect)) {
            this.#obs.onPlayerPulverizedIntoPulpyPuddles()
        }
    }
}

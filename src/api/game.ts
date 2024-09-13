import {type Entity, Player} from './entities.ts'
import {DrawContext} from './drawing.ts'
import {type Input, InputProcessor} from './input.ts'

const GAME_PAUSED = -1

export class Game {
    readonly #drawing: DrawContext
    readonly #entities: Array<Entity> = []
    readonly #input: InputProcessor
    readonly #player: Player
    #lastUpdate: number = 0
    #loopId: number = GAME_PAUSED

    constructor(canvas: HTMLCanvasElement) {
        this.#drawing = new DrawContext(canvas)
        this.#entities.push(this.#player = new Player(this.#drawing.canvasSize))
        this.#input = new InputProcessor(this.#onInput)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.start()
            } else {
                this.pause()
            }
        })
    }

    start() {
        if (this.#loopId === GAME_PAUSED) {
            this.#loopId = setInterval(this.#gameUpdate, 30)
            this.#input.bind()
        }
    }

    pause() {
        clearInterval(this.#loopId)
        this.#input.unbind()
        this.#loopId = GAME_PAUSED
    }

    #gameUpdate = () => {
        const now = Date.now()
        const elapsedTime = now - this.#lastUpdate
        this.#updateEntities(elapsedTime)
        this.#drawScene()
        this.#lastUpdate = Date.now()
    }

    #updateEntities(elapsedTime: number) {
        const canvasSize = this.#drawing.canvasSize
        for (const entity of this.#entities) {
            entity.update(elapsedTime, canvasSize)
        }
    }

    #drawScene() {
        this.#drawing.clear()
        for (const entity of this.#entities) {
            entity.draw(this.#drawing)
        }
    }

    #onInput = (input: Input, active: boolean) => {
        this.#player.handleInput(input, active)
    }
}

import {DrawContext} from './drawing.ts'
import {BadGuy, type Entity, Player} from './entities.ts'
import {type Input, InputProcessor} from './input.ts'

const GAME_PAUSED = -1

export interface GameObserver {
    onPlayerPulverizedIntoPulpyPuddles(): void
}

export class Game implements GameObserver {
    readonly #drawing: DrawContext
    readonly #entities: Array<Entity> = []
    readonly #input: InputProcessor
    readonly #player: Player
    #lastUpdate: number = 0
    #loopId: number = GAME_PAUSED

    constructor(canvas: HTMLCanvasElement) {
        this.#drawing = new DrawContext(canvas)
        this.#entities.push(this.#player = new Player(this.#drawing.size))
        this.#entities.push(new BadGuy(this.#drawing.size, this.#player, this))
        this.#input = new InputProcessor(this.#onInput)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.start()
            } else {
                this.#pause()
            }
        })
    }

    start() {
        if (this.#loopId === GAME_PAUSED) {
            this.#loopId = setInterval(this.#gameUpdate, 30)
            this.#input.bind()
        }
    }

    #pause() {
        clearInterval(this.#loopId)
        this.#input.unbind()
        this.#loopId = GAME_PAUSED
    }

    onPlayerPulverizedIntoPulpyPuddles() {
        this.#entities.splice(this.#entities.indexOf(this.#player), 1)
        const dialog = document.getElementById('game-over') as HTMLDialogElement
        dialog.showModal()
        dialog.querySelector('button')!.addEventListener('click', () => location.reload())
        this.#pause()
    }

    #gameUpdate = () => {
        const now = Date.now()
        const elapsedTime = now - this.#lastUpdate
        this.#updateEntities(elapsedTime)
        this.#drawScene()
        this.#lastUpdate = Date.now()
    }

    #updateEntities(elapsedTime: number) {
        const canvasSize = this.#drawing.size
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

export enum Input {
    moveUpActivate = 'move up activate',
    moveUpDeactivate = 'move up deactivate',
    moveRightActivate = 'move right activate',
    moveRightDeactivate = 'move right deactivate',
    moveDownActivate = 'move down activate',
    moveDownDeactivate = 'move down deactivate',
    moveLeftActivate = 'move left activate',
    moveLeftDeactivate = 'move left deactivate',
}

export type InputCallback = (input: Input) => void

export class InputProcessor {
    readonly #onPlayerInput: InputCallback

    constructor(onPlayerInput: InputCallback) {
        this.#onPlayerInput = onPlayerInput
    }

    bind() {
        document.addEventListener('keyup', this.#onKeyUp)
        document.addEventListener('keydown', this.#onKeyDown)
    }

    unbind() {
        document.removeEventListener('keyup', this.#onKeyUp)
        document.removeEventListener('keydown', this.#onKeyDown)
    }

    #onKeyUp = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'ArrowUp':
                this.#onPlayerInput(Input.moveUpDeactivate)
                break
            case 'ArrowRight':
                this.#onPlayerInput(Input.moveRightDeactivate)
                break
            case 'ArrowDown':
                this.#onPlayerInput(Input.moveDownDeactivate)
                break
            case 'ArrowLeft':
                this.#onPlayerInput(Input.moveLeftDeactivate)
                break
        }
    }

    #onKeyDown = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'ArrowUp':
                this.#onPlayerInput(Input.moveUpActivate)
                break
            case 'ArrowRight':
                this.#onPlayerInput(Input.moveRightActivate)
                break
            case 'ArrowDown':
                this.#onPlayerInput(Input.moveDownActivate)
                break
            case 'ArrowLeft':
                this.#onPlayerInput(Input.moveLeftActivate)
                break
        }
    }
}

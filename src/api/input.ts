export enum Input {
    moveUp = 'move up',
    moveRight = 'move right',
    moveDown = 'move down',
    moveLeft = 'move left',
}

function inputFromKeyCode(keyCode: string): Input | null {
    switch (keyCode) {
        case 'ArrowUp':
            return Input.moveUp
        case 'ArrowRight':
            return Input.moveRight
        case 'ArrowDown':
            return Input.moveDown
        case 'ArrowLeft':
            return Input.moveLeft
        default:
            return null
    }
}

export type InputCallback = (input: Input, active: boolean) => void

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

    #onKeyUp = (e: KeyboardEvent) => this.#onKeyEvent(e.code, false)

    #onKeyDown = (e: KeyboardEvent) => this.#onKeyEvent(e.code, true)

    #onKeyEvent(keyCode: string, active: boolean) {
        const gameInput = inputFromKeyCode(keyCode)
        if (gameInput) {
            this.#onPlayerInput(gameInput, active)
        }
    }
}

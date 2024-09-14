import {Direction} from './direction.ts'
import {type DrawContext, ImageResource} from '../drawing.ts'
import type {Rect, Size} from '../geometry.ts'
import type {Entity} from './entity.ts'
import {Input} from '../input.ts'

const SPEED_PPS = 15
const STRIDE_MS = 350

export class Player implements Entity {
    readonly #img: CanvasImageSource = ImageResource.playerCharacter()
    readonly #rect: Rect = {
        w: 30,
        h: 60,
        x: 0,
        y: 0,
    }
    #altStep: boolean = false
    #altStepWhen: number = 0
    #direction: Direction = Direction.down
    #moving: boolean = false
    #state: PlayerState = new StillState()

    constructor(Size: Size) {
        this.#rect.x = (Size.w / 2) - (this.#rect.w / 2)
        this.#rect.y = (Size.h / 2) - (this.#rect.h / 2)
    }

    handleInput(input: Input, active: boolean) {
        const update = this.#state.handleInput(this, input, active)
        if (update) {
            this.#state = update
            this.#state.enter(this)
        }
    }

    get rect(): Rect {
        return this.#rect
    }

    update(elapsedTime: number, Size: Size) {
        if (this.#moving) {
            const moveDistance = SPEED_PPS / (elapsedTime * .1)
            switch (this.#direction) {
                case Direction.upLeft:
                    this.#rect.y -= moveDistance
                    this.#rect.x -= moveDistance
                    break
                case Direction.up:
                    this.#rect.y -= moveDistance
                    break
                case Direction.upRight:
                    this.#rect.y -= moveDistance
                    this.#rect.x += moveDistance
                    break
                case Direction.right:
                    this.#rect.x += moveDistance
                    break
                case Direction.downRight:
                    this.#rect.y += moveDistance
                    this.#rect.x += moveDistance
                    break
                case Direction.down:
                    this.#rect.y += moveDistance
                    break
                case Direction.downLeft:
                    this.#rect.y += moveDistance
                    this.#rect.x -= moveDistance
                    break
                case Direction.left:
                    this.#rect.x -= moveDistance
                    break
            }
            if (this.#rect.x < 0) {
                this.#rect.x = 0
            } else {
                const maxX = Size.w - this.#rect.w
                if (this.#rect.x > maxX) {
                    this.#rect.x = maxX
                }
            }
            if (this.#rect.y < 0) {
                this.#rect.y = 0
            } else {
                const maxY = Size.h - this.#rect.h
                if (this.#rect.y > maxY) {
                    this.#rect.y = maxY
                }
            }
            this.#calculateStride()
        }
    }

    draw(drawing: DrawContext) {
        // drawing.drawRect('orange', this.#rect)
        drawing.drawImage(this.#img, this.#spriteIndex() * 17, 0, 15, 24, this.#rect)
    }

    moveInDirection(direction: Direction) {
        if (direction !== this.#direction) {
            this.#altStep = false
            this.#altStepWhen = Date.now() + STRIDE_MS
        }
        this.#direction = direction
        this.#moving = true
    }

    stopMoving() {
        this.#moving = false
    }

    #calculateStride() {
        const now = Date.now()
        if (now > this.#altStepWhen) {
            this.#altStep = !this.#altStep
            this.#altStepWhen = now + STRIDE_MS
        }
    }

    #spriteIndex(): number {
        const step = this.#altStep ? 0 : 1
        switch (this.#direction) {
            case Direction.upLeft:
                return 6 + step
            case Direction.up:
                return 8 + step
            case Direction.upRight:
                return 11 + step
            case Direction.right:
                return 13 + step
            case Direction.downRight:
                return 15 + step
            case Direction.down:
                return step
            case Direction.downLeft:
                return 2 + step
            case Direction.left:
                return 4 + step
        }
    }
}

export interface PlayerState {
    enter(player: Player): void

    handleInput(player: Player, input: Input, active: boolean): PlayerState | null
}

export class StillState implements PlayerState {
    enter(player: Player): void {
        player.stopMoving()
    }

    handleInput(_player: Player, input: Input, active: boolean): PlayerState | null {
        switch (input) {
            case Input.moveUp:
            case Input.moveRight:
            case Input.moveDown:
            case Input.moveLeft:
                if (active) {
                    return new MovingState(input)
                }
                break
        }
        return null
    }
}

export class MovingState implements PlayerState {
    readonly #moving: Partial<Record<Input, boolean>> = {
        [Input.moveUp]: false,
        [Input.moveRight]: false,
        [Input.moveDown]: false,
        [Input.moveLeft]: false,
    }

    constructor(input: Input) {
        this.#moving[input] = true
    }

    enter(player: Player): void {
        this.#updateMoveDirection(player)
    }

    handleInput(player: Player, input: Input, active: boolean): PlayerState | null {
        if (active) {
            this.#moving[oppositeMoveInputDirection(input)] = false
        }
        switch (input) {
            case Input.moveUp:
            case Input.moveRight:
            case Input.moveDown:
            case Input.moveLeft:
                this.#moving[input] = active
                if (Object.keys(this.#moving).some(input => this.#moving[input as Input])) {
                    this.#updateMoveDirection(player)
                    return null
                } else {
                    return new StillState()
                }
            default:
                return null
        }
    }

    #updateMoveDirection(player: Player) {
        let direction
        if (this.#moving[Input.moveUp]) {
            if (this.#moving[Input.moveLeft]) {
                direction = Direction.upLeft
            } else if (this.#moving[Input.moveRight]) {
                direction = Direction.upRight
            } else {
                direction = Direction.up
            }
        } else if (this.#moving[Input.moveRight]) {
            if (this.#moving[Input.moveUp]) {
                direction = Direction.upRight
            } else if (this.#moving[Input.moveDown]) {
                direction = Direction.downRight
            } else {
                direction = Direction.right
            }
        } else if (this.#moving[Input.moveLeft]) {
            if (this.#moving[Input.moveUp]) {
                direction = Direction.upLeft
            } else if (this.#moving[Input.moveDown]) {
                direction = Direction.downLeft
            } else {
                direction = Direction.left
            }
        } else {
            if (this.#moving[Input.moveLeft]) {
                direction = Direction.downLeft
            } else if (this.#moving[Input.moveRight]) {
                direction = Direction.downRight
            } else {
                direction = Direction.down
            }
        }
        player.moveInDirection(direction)
    }
}

function oppositeMoveInputDirection(input: Input): Input {
    switch (input) {
        case Input.moveUp:
            return Input.moveDown
        case Input.moveRight:
            return Input.moveLeft
        case Input.moveDown:
            return Input.moveUp
        case Input.moveLeft:
            return Input.moveRight
        default:
            throw new Error()
    }
}

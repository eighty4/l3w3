import type {CanvasSize, DrawContext} from './drawing.ts'
import {Input} from './input.ts'

export interface Entity {
    draw(drawing: DrawContext): void

    update(elapsedTime: number, canvasSize: { w: number, h: number }): void
}

export class Player implements Entity {
    state: PlayerState = new StillState()
    x: number
    y: number
    w: number = 30
    h: number = 60
    moveX: number = 0
    moveY: number = 0
    rectColor: string = 'orange'
    speed: number = 10

    constructor(canvasSize: CanvasSize) {
        this.x = (canvasSize.w / 2) - (this.w / 2)
        this.y = (canvasSize.h / 2) - (this.h / 2)
    }

    handleInput(input: Input) {
        const update = this.state.handleInput(this, input)
        console.log(input, update)
        if (update) {
            this.state = update
            this.state.enter(this)
        }
    }

    update(elapsedTime: number, canvasSize: CanvasSize) {
        if (this.moveX !== 0 || this.moveY !== 0) {
            const moveDistance = this.speed / (elapsedTime * .1)
            if (this.moveX > 0) {
                // moving right
                const moveDistanceX = Math.min(this.moveX, moveDistance)
                this.moveX -= moveDistanceX
                this.x = Math.min(canvasSize.w - this.w, this.x + moveDistanceX)
            } else if (this.moveX < 0) {
                // moving left
                const moveDistanceX = Math.min(Math.abs(this.moveX), moveDistance)
                this.moveX += moveDistanceX
                this.x = Math.max(0, this.x - moveDistanceX)
            }
            if (this.moveY > 0) {
                // moving down
                const moveDistanceY = Math.min(this.moveY, moveDistance)
                this.moveY -= moveDistanceY
                this.y = Math.min(canvasSize.h - this.h, this.y + moveDistanceY)
            } else if (this.moveY < 0) {
                // moving up
                const moveDistanceY = Math.min(Math.abs(this.moveY), moveDistance)
                this.moveY += moveDistanceY
                this.y = Math.max(0, this.y - moveDistanceY)
            }
        }
    }

    draw(drawing: DrawContext) {
        drawing.drawRect(this.rectColor, this.x, this.y, this.w, this.h)
    }
}

export interface PlayerState {
    enter(player: Player): void

    handleInput(player: Player, input: Input): PlayerState | null
}

export class StillState implements PlayerState {
    enter(_player: Player): void {
    }

    handleInput(_player: Player, input: Input): PlayerState | null {
        switch (input) {
            case Input.moveUpActivate:
                return new MovingState(Direction.up)
            case Input.moveRightActivate:
                return new MovingState(Direction.right)
            case Input.moveDownActivate:
                return new MovingState(Direction.down)
            case Input.moveLeftActivate:
                return new MovingState(Direction.left)
            default:
                return null
        }
    }
}

enum Direction {
    up,
    right,
    down,
    left,
}

export class MovingState implements PlayerState {
    readonly #direction: Direction

    constructor(direction: Direction) {
        this.#direction = direction
    }

    enter(player: Player): void {
        switch (this.#direction) {
            case Direction.up:
                player.rectColor = 'blue'
                player.moveY -= player.speed
                break
            case Direction.right:
                player.rectColor = 'pink'
                player.moveX += player.speed
                break
            case Direction.down:
                player.rectColor = 'yellow'
                player.moveY += player.speed
                break
            case Direction.left:
                player.rectColor = 'green'
                player.moveX -= player.speed
                break
        }
    }

    handleInput(_player: Player, input: Input): PlayerState | null {
        switch (input) {
            case Input.moveUpDeactivate:
            case Input.moveRightDeactivate:
            case Input.moveDownDeactivate:
            case Input.moveLeftDeactivate:
                return new StillState()
            default:
                return null
        }
    }
}

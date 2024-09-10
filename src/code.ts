import {Game} from './api/game.ts'

const canvas = document.body.querySelector('canvas') as HTMLCanvasElement
const game = new Game(canvas)

if (document.visibilityState === 'visible') {
    game.start()
}

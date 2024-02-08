import { ReactInputPositionContext } from '../interface'
import utils from '../utils'

function mouseDown(this: ReactInputPositionContext) {
    this.mouseDown = true
}

function mouseUp(this: ReactInputPositionContext) {
    this.mouseDown = false
}

function mouseMove(this: ReactInputPositionContext, e: MouseEvent) {
    const position = { x: e.clientX, y: e.clientY }

    if (!this.getState().active) {
        return this.activate(position)
    }

    this.setPosition(position, this.mouseDown)
}

function mouseEnter(this: ReactInputPositionContext, e: MouseEvent) {
    const position = { x: e.clientX, y: e.clientY }
    this.activate(position)
}

function mouseLeave(this: ReactInputPositionContext) {
    this.deactivate()
    this.mouseDown = false
}

export default {
    mouseDown,
    mouseUp,
    mouseMove,
    mouseEnter,
    mouseLeave,
    dragStart: utils.preventDefault,
}

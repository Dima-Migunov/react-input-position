import { ReactInputPositionContext } from '../interface'
import utils from '../utils'

function mouseDown(this: ReactInputPositionContext) {
    this.mouseDown = true
}

function mouseUp(this: ReactInputPositionContext) {
    this.mouseDown = false
}

function dblClick(this: ReactInputPositionContext, e: MouseEvent) {
    this.toggleActive({ x: e.clientX, y: e.clientY })
}

function mouseMove(this: ReactInputPositionContext, e: MouseEvent) {
    const position = { x: e.clientX, y: e.clientY }

    if (!this.getState().active) {
        return this.setPassivePosition(position)
    }

    this.setPosition(position, this.mouseDown)
}

function mouseLeave(this: ReactInputPositionContext) {
    this.mouseDown = false
}

export default {
    mouseDown,
    mouseUp,
    dblClick,
    mouseMove,
    mouseLeave,
    dragStart: utils.preventDefault,
}

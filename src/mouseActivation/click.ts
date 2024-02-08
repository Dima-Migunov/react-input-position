import { ReactInputPositionContext } from '../interface'
import utils from '../utils'

function mouseDown(this: ReactInputPositionContext, e: MouseEvent) {
    this.mouseDown = true

    this.clickMoveStartRef = e.clientX + e.clientY
}

function mouseUp(this: ReactInputPositionContext, e: MouseEvent) {
    if (!this.mouseDown) return

    this.mouseDown = false

    const position = { x: e.clientX, y: e.clientY }

    const clickMoveEnd = position.x + position.y
    const diff = Math.abs(this.clickMoveStartRef - clickMoveEnd)

    if (diff < this.props.clickMoveLimit) {
        this.toggleActive(position)
    }
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
    mouseMove,
    mouseLeave,
    dragStart: utils.preventDefault,
}

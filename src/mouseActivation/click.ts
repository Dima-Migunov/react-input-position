// @ts-nocheck
import utils from '../utils'

function mouseDown(e: MouseEvent): void {
    this.mouseDown = true
    this.clickMoveStartRef = e.clientX + e.clientY
}

function mouseUp(e: MouseEvent): void {
    if (!this.mouseDown) return

    this.mouseDown = false

    const position = { x: e.clientX, y: e.clientY }
    const clickMoveEnd = position.x + position.y
    const diff = Math.abs(this.clickMoveStartRef - clickMoveEnd)

    if (diff < this.props.clickMoveLimit) {
        this.toggleActive(position)
    }
}

function mouseMove(e: MouseEvent): void {
    const position = { x: e.clientX, y: e.clientY }

    if (!this.getState().active) {
        this.setPassivePosition(position)
    } else {
        this.setPosition(position, this.mouseDown)
    }
}

function mouseLeave(): void {
    this.mouseDown = false
}

export default {
    mouseDown,
    mouseUp,
    mouseMove,
    mouseLeave,
    dragStart: utils.preventDefault,
}

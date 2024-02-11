// @ts-nocheck
import utils from '../utils'

function mouseDown(): void {
    this.mouseDown = true
}

function mouseUp(): void {
    this.mouseDown = false
}

function dblClick(e: MouseEvent): void {
    const position = { x: e.clientX, y: e.clientY }
    this.toggleActive(position)
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
    dblClick,
    mouseMove,
    mouseLeave,
    dragStart: utils.preventDefault,
}

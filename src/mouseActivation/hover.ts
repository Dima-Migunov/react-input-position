// @ts-nocheck
import utils from '../utils'

function mouseDown(): void {
    this.mouseDown = true
}

function mouseUp(): void {
    this.mouseDown = false
}

function mouseMove(e: MouseEvent): void {
    const position = { x: e.clientX, y: e.clientY }

    if (!this.getState().active) {
        this.activate(position)
    } else {
        this.setPosition(position, this.mouseDown)
    }
}

function mouseEnter(e: MouseEvent): void {
    const position = { x: e.clientX, y: e.clientY }
    this.activate(position)
}

function mouseLeave(): void {
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

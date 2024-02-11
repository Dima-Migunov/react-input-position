// @ts-nocheck
import { DeviceHandler } from '../types'
import utils from '../utils'

function mouseDown(e: MouseEvent): void {
    this.activate({ x: e.clientX, y: e.clientY })
}

function mouseUp(): void {
    this.deactivate()

    if (this.mouseOutside) {
        addRemoveOutsideHandlers.call(this)
    }
}

function mouseMove(e: MouseEvent): void {
    const position = { x: e.clientX, y: e.clientY }

    if (!this.getState().active) {
        this.setPassivePosition(position)
    } else {
        this.setPosition(position, true)
    }
}

function mouseEnter(): void {
    if (this.mouseOutside) {
        this.mouseOutside = false
        addRemoveOutsideHandlers.call(this)
    }
}

function mouseLeave(): void {
    if (!this.getState().active) {
        return
    }

    if (!this.props.mouseDownAllowOutside) {
        this.deactivate()
    } else {
        this.mouseOutside = true
        addRemoveOutsideHandlers.call(this, true)
    }
}

function addRemoveOutsideHandlers(add: boolean): void {
    this.mouseHandlers
        .filter((h: DeviceHandler) => h.event === 'mouseup' || h.event === 'mousemove')
        .forEach(({ event, handler }: DeviceHandler) => {
            if (add) {
                window.addEventListener(event, handler)
            } else {
                window.removeEventListener(event, handler)
            }
        })
}

export default {
    mouseDown,
    mouseUp,
    mouseMove,
    mouseLeave,
    mouseEnter,
    dragStart: utils.preventDefault,
}

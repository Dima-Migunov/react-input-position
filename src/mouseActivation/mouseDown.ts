import { ReactInputPositionContext } from '../interface'
import utils from '../utils'

function mouseDown(this: ReactInputPositionContext, e: MouseEvent) {
    const position = { x: e.clientX, y: e.clientY }
    this.activate(position)
}

function mouseUp(this: ReactInputPositionContext) {
    this.deactivate()

    if (this.mouseOutside) {
        addRemoveOutsideHandlers.call(this)
    }
}

function mouseMove(this: ReactInputPositionContext, e: MouseEvent) {
    const position = { x: e.clientX, y: e.clientY }

    if (!this.getState().active) {
        return this.setPassivePosition(position)
    }

    this.setPosition(position, true)
}

function mouseEnter(this: ReactInputPositionContext) {
    if (this.mouseOutside) {
        this.mouseOutside = false
        addRemoveOutsideHandlers.call(this)
    }
}

function mouseLeave(this: ReactInputPositionContext) {
    if (!this.getState().active) {
        return
    }

    if (!this.props.mouseDownAllowOutside) {
        return this.deactivate()
    }

    this.mouseOutside = true
    addRemoveOutsideHandlers.call(this, true)
}

function addRemoveOutsideHandlers(this: ReactInputPositionContext, add?: boolean) {
    this.mouseHandlers
        .filter((h) => h.event === 'mouseup' || h.event === 'mousemove')
        .forEach(({ event, handler }) => {
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

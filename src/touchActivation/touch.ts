import { ReactInputPositionContext } from '../interface'

function touchStart(this: ReactInputPositionContext, e: TouchEvent) {
    this.touched = true
    this.justTouched = true

    const touch = e.touches[0]
    const position = { x: touch.clientX, y: touch.clientY }
    this.activate(position)
}

function touchEnd(this: ReactInputPositionContext, e: TouchEvent) {
    if (e.cancelable) e.preventDefault()

    this.touched = false
    this.justTouched = false

    this.deactivate()
}

function touchMove(this: ReactInputPositionContext, e: TouchEvent) {
    if (!this.getState().active) return
    if (e.cancelable) e.preventDefault()

    const touch = e.touches[0]
    const position = { x: touch.clientX, y: touch.clientY }
    this.setPosition(position, this.touched && !this.justTouched)
    this.justTouched = false
}

function touchCancel(this: ReactInputPositionContext) {
    this.deactivate()
}

export default {
    touchStart,
    touchEnd,
    touchMove,
    touchCancel,
}

import { ReactInputPositionContext } from '../interface'

function touchStart(this: ReactInputPositionContext, e: TouchEvent) {
    this.touched = true
    this.justTouched = true

    clearTimeout(this.longTouchTimer)

    const touch = e.touches[0]
    const position = { x: touch.clientX, y: touch.clientY }
    this.longTouchStartRef = position.x + position.y
    this.startLongTouchTimer(position)
}

function touchEnd(this: ReactInputPositionContext, e: TouchEvent) {
    if (e.cancelable) e.preventDefault()

    this.touched = false
    this.justTouched = false
}

function touchMove(this: ReactInputPositionContext, e: TouchEvent) {
    const touch = e.touches[0]
    const position = { x: touch.clientX, y: touch.clientY }
    const end = position.x + position.y
    const diff = Math.abs(this.longTouchStartRef - end)

    if (diff > this.props.longTouchMoveLimit) {
        clearTimeout(this.longTouchTimer)
    }

    if (!this.getState().active) return
    if (e.cancelable) e.preventDefault()

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
import { ReactInputPositionContext } from '../interface'

function touchStart(this: ReactInputPositionContext) {
    this.touched = true
    this.justTouched = true
    this.startTapTimer()
}

function touchEnd(this: ReactInputPositionContext, e: TouchEvent) {
    if (e.cancelable) e.preventDefault()

    this.touched = false
    this.justTouched = false

    if (this.tapTimedOut) {
        this.tapTimedOut = false
        return
    }

    clearTimeout(this.tapTimer)

    if (this.tapped && !this.doubleTapTimedOut) {
        clearTimeout(this.doubleTapTimer)

        const touch = e.changedTouches[0]
        const position = { x: touch.clientX, y: touch.clientY }
        this.toggleActive(position)

        this.tapped = false
        return
    }

    this.tapTimedOut = false
    this.doubleTapTimedOut = false
    this.tapped = true
    this.startDoubleTapTimer()
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

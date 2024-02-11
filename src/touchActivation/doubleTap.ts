// @ts-nocheck

function touchStart(): void {
    this.touched = true
    this.justTouched = true
    this.startTapTimer()
}

function touchEnd(e: TouchEvent): void {
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
        this.toggleActive({ x: touch.clientX, y: touch.clientY })

        this.tapped = false
        return
    }

    this.tapTimedOut = false
    this.doubleTapTimedOut = false
    this.tapped = true
    this.startDoubleTapTimer()
}

function touchMove(e: TouchEvent): void {
    if (!this.getState().active) return
    if (e.cancelable) e.preventDefault()

    const touch = e.touches[0]
    const position = { x: touch.clientX, y: touch.clientY }
    this.setPosition(position, this.touched && !this.justTouched)
    this.justTouched = false
}

function touchCancel(): void {
    this.deactivate()
}

export default {
    touchStart,
    touchEnd,
    touchMove,
    touchCancel,
}

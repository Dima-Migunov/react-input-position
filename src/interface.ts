import { DeviceHandler, Position } from './types'

export interface ReactInputPositionContext {
    // state: typeof defaultState
    // props: {
    //     [key: string]: any
    // }

    activate: (p: Position) => void
    clickMoveStartRef: number
    containerRef: React.RefObject<unknown>
    deactivate: () => void
    doubleTapTimedOut: boolean
    doubleTapTimer: number | undefined
    itemRef: React.RefObject<unknown>
    justTouched: boolean
    longTouchStartRef: number
    longTouchTimedOut: boolean
    longTouchTimer: number | undefined
    mouseDown: boolean
    mouseHandlers: DeviceHandler[]
    mouseOutside: boolean
    refresh: boolean
    startDoubleTapTimer: () => void
    startLongTouchTimer: (p: Position) => void
    startTapTimer: () => void
    supportsPassive: boolean
    tapped: boolean
    tapTimedOut: boolean
    tapTimer: number | undefined
    touched: boolean
    touchHandlers: DeviceHandler[]
    // ----------------------------------
    toggleActive: (p: Position) => void
    getState: any
    setPassivePosition: (p: Position) => void
    setPosition: (p: Position, updateItemPosition: boolean, activate: boolean, centerItem?: boolean) => void
}

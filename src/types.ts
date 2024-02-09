import { defaultState } from './constants'

export type DeviceHandler = { event: string; handler: (...args: any[]) => any }

export type Dimensions = { width: number; height: number }

export type Offset = { left: number; top: number }

export type Position = { x: number; y: number }

export type State = {
    active?: any
    activePosition?: Position
    itemPosition?: Position
    passivePosition?: Position
    prevActivePosition?: Position
    elementDimensions?: Dimensions
    itemDimensions?: Dimensions
    elementOffset?: Offset
}

export type ComponentProps = {
    alignItemOnActivePos: boolean
    centerItemOnActivate: boolean
    centerItemOnActivatePos: boolean
    centerItemOnLoad: boolean
    clickMoveLimit: number
    doubleTapDurationInMs: number
    itemMovementMultiplier: number
    itemPositionLimitBySize: boolean
    itemPositionLimitInternal: boolean
    itemPositionMinX: number
    itemPositionMinY: number
    itemPositionMaxX: number
    itemPositionMaxY: number
    linkItemToActive: boolean
    longTouchDurationInMs: number
    longTouchMoveLimit: number
    minUpdateSpeedInMs: number
    mouseActivationMethod: string
    mouseDownAllowOutside: boolean
    onActivate: (...args: any[]) => any
    onDeactivate: (...args: any[]) => any
    onUpdate: (...args: any[]) => any
    overrideState: typeof defaultState
    tapDurationInMs: number
    tapTimer: number | undefined
    touchActivationMethod: string
    trackItemPosition: boolean
    trackPassivePosition: Position
    trackPreviousPosition: Position

    cursorStyle: string
    cursorStyleActive: string
    [elemName: string]: any
}

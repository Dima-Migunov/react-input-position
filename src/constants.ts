export const MOUSE_ACTIVATION = {
    CLICK: 'click',
    DOUBLE_CLICK: 'doubleClick',
    HOVER: 'hover',
    MOUSE_DOWN: 'mouseDown',
}

export const TOUCH_ACTIVATION = {
    DOUBLE_TAP: 'doubleTap',
    LONG_TOUCH: 'longTouch',
    TAP: 'tap',
    TOUCH: 'touch',
}

export const defaultState = {
    active: false,
    activePosition: { x: 0, y: 0 },
    prevActivePosition: { x: 0, y: 0 },
    passivePosition: { x: 0, y: 0 },
    elementDimensions: { width: 0, height: 0 },
    elementOffset: { left: 0, top: 0 },
    itemPosition: { x: 0, y: 0 },
    itemDimensions: { width: 0, height: 0 },
}

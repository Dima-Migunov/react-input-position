import React, { Component } from 'react'
import mouseActivation from './mouseActivation'
import touchActivation from './touchActivation'
import { MOUSE_ACTIVATION, TOUCH_ACTIVATION } from './constants'
import utils from './utils'
import { ComponentProps, DeviceHandler, Position, State } from './types'
import { ReactInputPositionContext } from './interface'

const defaultState = {
    active: false,
    activePosition: { x: 0, y: 0 },
    prevActivePosition: { x: 0, y: 0 },
    passivePosition: { x: 0, y: 0 },
    elementDimensions: { width: 0, height: 0 },
    elementOffset: { left: 0, top: 0 },
    itemPosition: { x: 0, y: 0 },
    itemDimensions: { width: 0, height: 0 },
}

class ReactInputPosition extends Component<ComponentProps> implements ReactInputPositionContext {
    state = defaultState

    containerRef = React.createRef<HTMLDivElement>()
    itemRef = React.createRef<HTMLImageElement>()

    clickMoveStartRef: number = 0
    doubleTapTimedOut: boolean = false
    doubleTapTimer: number | undefined = undefined
    justTouched: boolean = false
    longTouchStartRef: number = 0
    longTouchTimedOut: boolean = false
    longTouchTimer: number | undefined = undefined
    mouseDown: boolean = false
    mouseHandlers: DeviceHandler[] = []
    mouseOutside: boolean = false
    refresh: boolean = true
    supportsPassive: boolean = false
    tapped: boolean = false
    tapTimedOut = false
    tapTimer: number | undefined = undefined
    touched: boolean = false
    touchHandlers: DeviceHandler[] = []

    static defaultProps = {
        tapDurationInMs: 180,
        doubleTapDurationInMs: 400,
        longTouchDurationInMs: 500,
        longTouchMoveLimit: 5,
        clickMoveLimit: 5,
        style: {},
        minUpdateSpeedInMs: 1,
        itemMovementMultiplier: 1,
        cursorStyle: 'crosshair',
        mouseActivationMethod: MOUSE_ACTIVATION.CLICK,
        touchActivationMethod: TOUCH_ACTIVATION.TAP,
        mouseDownAllowOutside: false,
    }

    componentDidMount() {
        this.init()
        this.refreshPosition()
    }

    componentWillUnmount() {
        this.removeMouseEventListeners()
        this.removeTouchEventListeners()
        this.removeOtherEventListeners()
    }

    componentDidUpdate(prevProps: { [key: string]: any }) {
        if (prevProps.mouseActivationMethod !== this.props.mouseActivationMethod) {
            this.removeMouseEventListeners()
            this.setMouseInteractionMethods()
            this.addMouseEventListeners()
        }

        if (prevProps.touchActivationMethod !== this.props.touchActivationMethod) {
            this.removeTouchEventListeners()
            this.setTouchInteractionMethods()
            this.addTouchEventListeners()
        }
    }

    init() {
        this.checkPassiveEventSupport()
        this.setInputInteractionMethods()
        this.addMouseEventListeners()
        this.addTouchEventListeners()
        this.addOtherEventListeners()
    }

    checkPassiveEventSupport() {
        this.supportsPassive = false
        try {
            const options = Object.defineProperty({}, 'passive', {
                get: () => (this.supportsPassive = true),
            })
            window.addEventListener('testPassive', () => {}, options)
            window.removeEventListener('testPassive', () => {}, options)
        } catch (e) {}
    }

    updateState(changes: State, cb?: any) {
        const { onUpdate } = this.props

        let activationCallback: ((...args: any[]) => any) | undefined

        if (changes.hasOwnProperty('active')) {
            activationCallback = changes.active ? this.props.onActivate : this.props.onDeactivate
        }

        if (this.props.overrideState) {
            onUpdate && onUpdate(changes)
            activationCallback && activationCallback()
            cb && cb.call(this)
            return
        }

        this.setState(
            () => changes,
            () => {
                cb && cb.call(this)
                activationCallback && activationCallback()
                onUpdate && onUpdate(this.getStateClone())
            }
        )
    }

    getState() {
        return this.props.overrideState ? this.props.overrideState : this.state
    }

    getStateClone() {
        return JSON.parse(JSON.stringify(this.getState()))
    }

    onLoadRefresh = () => {
        this.refreshPosition()
    }

    refreshPosition() {
        const { trackItemPosition, centerItemOnLoad } = this.props
        this.setPosition({ x: 0, y: 0 }, trackItemPosition ?? false, false, centerItemOnLoad)
    }

    setInputInteractionMethods() {
        this.setMouseInteractionMethods()
        this.setTouchInteractionMethods()
    }

    setMouseInteractionMethods() {
        if (!this.props.mouseActivationMethod) return

        const mouseInteractionMethods = mouseActivation[this.props.mouseActivationMethod]
        this.mouseHandlers = []

        for (let key in mouseInteractionMethods) {
            this.mouseHandlers.push({
                event: key.toLowerCase(),
                handler: mouseInteractionMethods[key].bind(this),
            })
        }
    }

    setTouchInteractionMethods() {
        if (!this.props.touchActivationMethod) return

        const touchInteractionMethods = touchActivation[this.props.touchActivationMethod]
        this.touchHandlers = []

        for (let key in touchInteractionMethods) {
            this.touchHandlers.push({
                event: key.toLowerCase(),
                handler: touchInteractionMethods[key].bind(this),
            })
        }
    }

    handleResize = () => {
        this.refreshPosition()
    }

    setPosition(position: Position, updateItemPosition: boolean, activate: boolean, centerItem?: boolean) {
        if (this.props.minUpdateSpeedInMs && !this.refresh) return
        if (!this.containerRef.current) return

        this.refresh = false

        const { left, top, width, height } = this.containerRef.current.getBoundingClientRect()

        const {
            trackItemPosition,
            trackPassivePosition,
            trackPreviousPosition,
            centerItemOnActivate,
            centerItemOnActivatePos,
            linkItemToActive,
            itemMovementMultiplier,
            alignItemOnActivePos,
            itemPositionMinX,
            itemPositionMaxX,
            itemPositionMinY,
            itemPositionMaxY,
            itemPositionLimitBySize,
            itemPositionLimitInternal,
        } = this.props

        const { activePosition, itemPosition } = this.getState()

        // Set container div info and active position
        const stateUpdate: { [key: string]: any } = {
            elementDimensions: { width, height },
            elementOffset: { left, top },
            activePosition: {
                x: Math.min(Math.max(0, position.x - left), width),
                y: Math.min(Math.max(0, position.y - top), height),
            },
        }

        // Activate if necessary
        if (activate) stateUpdate.active = true

        // Set item dimensions
        if (this.itemRef.current) {
            const itemSize = this.itemRef.current.getBoundingClientRect()

            stateUpdate.itemDimensions = {
                width: itemSize.width,
                height: itemSize.height,
            }
        }

        // Set previous active position
        if (trackPreviousPosition || trackItemPosition) {
            stateUpdate.prevActivePosition = {
                x: activePosition.x,
                y: activePosition.y,
            }
        }

        // Set passive position
        if (trackPassivePosition) {
            stateUpdate.passivePosition = {
                x: position.x - left,
                y: position.y - top,
            }
        }

        // Create adjusted limits
        const limits = utils.createAdjustedLimits(
            itemPositionMinX ?? 0,
            itemPositionMaxX ?? 0,
            itemPositionMinY ?? 0,
            itemPositionMaxY ?? 0,
            stateUpdate.elementDimensions,
            stateUpdate.itemDimensions,
            itemPositionLimitBySize ?? false,
            itemPositionLimitInternal ?? false
        )

        // Center item
        if (centerItem || (activate && centerItemOnActivate)) {
            const centerX = (limits.maxX + limits.minX) / 2
            const centerY = (limits.maxY + limits.minY) / 2

            stateUpdate.itemPosition = {
                x: centerX || 0,
                y: centerY || 0,
            }

            return this.updateState(stateUpdate, this.startRefreshTimer)
        }

        let shouldLimitItem = true

        // Set item position
        if (trackItemPosition && linkItemToActive) {
            stateUpdate.itemPosition = { ...stateUpdate.activePosition }
        } else if (trackItemPosition && alignItemOnActivePos) {
            stateUpdate.itemPosition = utils.alignItemOnPosition(
                stateUpdate.elementDimensions,
                stateUpdate.itemDimensions,
                stateUpdate.activePosition
            )
        } else if (trackItemPosition && activate && centerItemOnActivatePos) {
            stateUpdate.itemPosition = utils.centerItemOnPosition(
                stateUpdate.elementDimensions,
                stateUpdate.itemDimensions,
                stateUpdate.activePosition
            )
        } else if (trackItemPosition && updateItemPosition) {
            stateUpdate.itemPosition = utils.calculateItemPosition(
                itemPosition,
                stateUpdate.prevActivePosition,
                stateUpdate.activePosition,
                itemMovementMultiplier ?? 1
            )
        } else {
            shouldLimitItem = false
        }

        // Apply position limits
        if (shouldLimitItem) {
            stateUpdate.itemPosition = utils.limitPosition(
                limits.minX,
                limits.maxX,
                limits.minY,
                limits.maxY,
                stateUpdate.itemPosition
            )
        }

        this.updateState(stateUpdate, this.startRefreshTimer)
    }

    setPassivePosition(position: Position) {
        if (!this.props.trackPassivePosition || !this.containerRef.current) return

        const { left, top } = this.containerRef.current.getBoundingClientRect()

        this.updateState({
            passivePosition: {
                x: position.x - left,
                y: position.y - top,
            },
        })
    }

    toggleActive(position = { x: 0, y: 0 }) {
        if (!this.getState().active) {
            this.activate(position)
        } else {
            this.deactivate()
        }
    }

    activate(position = { x: 0, y: 0 }) {
        this.setPosition(position, false, true)
    }

    deactivate() {
        this.updateState({ active: false })
    }

    startRefreshTimer() {
        if (this.props.minUpdateSpeedInMs) {
            setTimeout(() => {
                this.refresh = true
            }, this.props.minUpdateSpeedInMs)
        }
    }

    startTapTimer() {
        this.tapTimer = setTimeout(() => {
            this.tapTimedOut = true
        }, this.props.tapDurationInMs)
    }

    startDoubleTapTimer() {
        this.doubleTapTimer = setTimeout(() => {
            this.doubleTapTimedOut = true
        }, this.props.doubleTapDurationInMs)
    }

    startLongTouchTimer(p: Position) {
        this.longTouchTimer = setTimeout(() => {
            if (this.touched) {
                this.toggleActive(p)
            }
        }, this.props.longTouchDurationInMs)
    }

    addMouseEventListeners() {
        this.mouseHandlers.forEach((mouse) => {
            this.containerRef.current?.addEventListener(mouse.event, mouse.handler)
        })
    }

    addTouchEventListeners() {
        this.touchHandlers.forEach((touch) => {
            this.containerRef.current?.addEventListener(
                touch.event,
                touch.handler,
                this.supportsPassive ? { passive: false } : false
            )
        })
    }

    removeMouseEventListeners() {
        this.mouseHandlers.forEach((mouse) => {
            this.containerRef.current?.removeEventListener(mouse.event, mouse.handler)
        })
    }

    removeTouchEventListeners() {
        this.touchHandlers.forEach((touch) => {
            this.containerRef.current?.removeEventListener(touch.event, touch.handler, this.supportsPassive)
        })
    }

    addOtherEventListeners() {
        window.addEventListener('resize', this.handleResize)
        window.addEventListener('load', this.onLoadRefresh)
    }

    removeOtherEventListeners() {
        window.removeEventListener('resize', this.handleResize)
        window.removeEventListener('load', this.onLoadRefresh)
    }

    render() {
        const { style, className, children, cursorStyle, cursorStyleActive } = this.props
        const { active } = this.getState()

        const combinedStyle = {
            ...style,
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none',
            cursor: active ? cursorStyleActive || cursorStyle : cursorStyle,
        }

        return (
            <div style={combinedStyle} className={className} ref={this.containerRef}>
                {utils.decorateChildren(children, {
                    ...this.getState(),
                    itemRef: this.itemRef,
                    onLoadRefresh: this.onLoadRefresh,
                })}
            </div>
        )
    }
}

export { MOUSE_ACTIVATION, TOUCH_ACTIVATION, defaultState }
export default ReactInputPosition

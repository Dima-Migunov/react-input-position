import React, { Component } from 'react'
import mouseActivation from './mouseActivation'
import touchActivation from './touchActivation'
import { MOUSE_ACTIVATION, TOUCH_ACTIVATION, defaultState } from './constants'
import utils from './utils'
import { ReactInputPositionContext } from './interface'
import { ComponentProps, DeviceHandler, Position, State } from './types'

export class ReactInputPosition extends Component<ComponentProps> implements ReactInputPositionContext {
    state = defaultState

    clickMoveStartRef = 0
    containerRef = React.createRef<HTMLDivElement>()
    doubleTapTimedOut = false
    doubleTapTimer: number | undefined = undefined
    justTouched = false
    itemRef = React.createRef<HTMLImageElement>()
    longTouchStartRef = 0
    longTouchTimedOut = false
    longTouchTimer: number | undefined = undefined
    mouseDown = false
    mouseOutside = false
    refresh = true
    supportsPassive = false
    tapped = false
    tapTimedOut = false
    tapTimer: number | undefined
    touched = false

    mouseHandlers: DeviceHandler[] = []
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

    componentDidMount(): void {
        this.init()
        this.refreshPosition()
    }

    componentWillUnmount(): void {
        this.removeMouseEventListeners()
        this.removeTouchEventListeners()
        this.removeOtherEventListeners()
    }

    componentDidUpdate(prevProps: ComponentProps): void {
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
        console.log('mouseActivation', mouseActivation)
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

        let activationCallback: any

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

    getStateClone(): State {
        return JSON.parse(JSON.stringify(this.getState()))
    }

    onLoadRefresh = () => {
        this.refreshPosition()
    }

    refreshPosition() {
        const { trackItemPosition, centerItemOnLoad } = this.props

        this.setPosition({ x: 0, y: 0 }, trackItemPosition, false, centerItemOnLoad)
    }

    setInputInteractionMethods() {
        this.setMouseInteractionMethods()
        this.setTouchInteractionMethods()
    }

    setMouseInteractionMethods() {
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
        const stateUpdate: State = {
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
            itemPositionMinX,
            itemPositionMaxX,
            itemPositionMinY,
            itemPositionMaxY,
            stateUpdate.elementDimensions,
            stateUpdate.itemDimensions,
            itemPositionLimitBySize,
            itemPositionLimitInternal
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
        if (trackItemPosition && linkItemToActive && stateUpdate.activePosition) {
            stateUpdate.itemPosition = { ...stateUpdate.activePosition }
        } else if (trackItemPosition && alignItemOnActivePos && stateUpdate.activePosition) {
            stateUpdate.itemPosition = utils.alignItemOnPosition(
                stateUpdate.elementDimensions,
                stateUpdate.itemDimensions,
                stateUpdate.activePosition
            )
        } else if (trackItemPosition && activate && centerItemOnActivatePos && stateUpdate.activePosition) {
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
                itemMovementMultiplier
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
        if (!this.props.trackPassivePosition) return
        if (!this.containerRef.current) return

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

    activate(position: Position = { x: 0, y: 0 }) {
        this.setPosition(position, false, true)
    }

    deactivate() {
        this.updateState({ active: false })
    }

    startRefreshTimer() {
        if (!this.props.minUpdateSpeedInMs) return

        setTimeout(() => {
            this.refresh = true
        }, this.props.minUpdateSpeedInMs)
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

    startLongTouchTimer(e: Position) {
        this.longTouchTimer = setTimeout(() => {
            if (this.touched) {
                this.toggleActive(e)
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
        this.touchHandlers.forEach((touch: DeviceHandler) => {
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

        const combinedStyle: { [key: string]: string } = {
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

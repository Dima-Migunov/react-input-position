import React, { useState } from 'react'
import ReactInputPosition, { MOUSE_ACTIVATION, TOUCH_ACTIVATION } from 'react-input-position-ts'
import ImageExampleRenderer from './ImageExampleRenderer'
import ImageExampleControls from './ImageExampleControls'
import SampleCode from './SampleCode'

export default function ImageExample({
    mouseActivation = MOUSE_ACTIVATION.CLICK,
    touchActivation = TOUCH_ACTIVATION.TAP,
    cursorStyle = 'zoom-in',
    cursorStyleActive = 'move',
    centerItemOnActivatePos = true,
}: {
    mouseActivation?: string
    touchActivation?: string
    cursorStyle?: string
    cursorStyleActive?: string
    centerItemOnActivatePos?: boolean
}) {
    const [mouse_activation, setMouseActivation] = useState(mouseActivation)
    const [touch_activation, setTouchActivation] = useState(touchActivation)
    const [center_itemOnActivatePos, setCenterItemOnActivatePos] = useState(centerItemOnActivatePos)

    return (
        <React.Fragment>
            <div className='image-example'>
                <ReactInputPosition
                    mouseActivationMethod={mouse_activation}
                    touchActivationMethod={touch_activation}
                    trackItemPosition
                    itemPositionLimitBySize
                    centerItemOnActivatePos={center_itemOnActivatePos}
                    cursorStyle={cursorStyle}
                    cursorStyleActive={cursorStyleActive}
                    className='input-position'
                >
                    <ImageExampleRenderer />
                    <div className='image-tip'>Drag to move while zoomed in.</div>
                </ReactInputPosition>

                <ImageExampleControls
                    setMouseActivation={setMouseActivation}
                    setTouchActivation={setTouchActivation}
                    setCenterItemOnActivatePos={setCenterItemOnActivatePos}
                    mouseMethod={mouse_activation}
                    touchMethod={touch_activation}
                />
            </div>
            <SampleCode />
        </React.Fragment>
    )
}

import { useState } from 'react'

import ReactInputPosition, { MOUSE_ACTIVATION, TOUCH_ACTIVATION } from 'react-input-position-ts'
import InputInfo from './InputInfo'
import PropsExampleControls from './PropsExampleControls'

export default function PropsExample() {
    const [mouseActivation, setMouseActivation] = useState<string>(MOUSE_ACTIVATION.CLICK)
    const [touchActivation, setTouchActivation] = useState<string>(TOUCH_ACTIVATION.TAP)
    const [trackPassivePosition, setTrackPassivePosition] = useState<boolean>(true)
    const [trackPreviousPosition, setTrackPreviousPosition] = useState<boolean>(false)
    const [trackItemPosition, setTrackItemPosition] = useState<boolean>(false)

    return (
        <div className='flex'>
            <ReactInputPosition
                mouseActivationMethod={mouseActivation}
                touchActivationMethod={touchActivation}
                trackPreviousPosition={trackPreviousPosition}
                trackPassivePosition={trackPassivePosition}
                trackItemPosition={trackItemPosition}
                cursorStyle='default'
                cursorStyleActive='crosshair'
                className='input-position'
            >
                <InputInfo />
            </ReactInputPosition>

            <PropsExampleControls
                setMouseActivation={setMouseActivation}
                setTouchActivation={setTouchActivation}
                setTrackPassivePosition={setTrackPassivePosition}
                setTrackPreviousPosition={setTrackPreviousPosition}
                setTrackItemPosition={setTrackItemPosition}
                mouseMethod={mouseActivation}
                touchMethod={touchActivation}
            />
        </div>
    )
}

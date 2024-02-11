import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { MOUSE_ACTIVATION, TOUCH_ACTIVATION } from 'react-input-position-ts'

const ImageExampleControls = ({
    setMouseActivation,
    setTouchActivation,
    setCenterItemOnActivatePos,
    mouseMethod,
    touchMethod,
}: {
    setMouseActivation: Dispatch<SetStateAction<string>>
    setTouchActivation: Dispatch<SetStateAction<string>>
    setCenterItemOnActivatePos: Dispatch<SetStateAction<boolean>>
    mouseMethod: string
    touchMethod: string
}) => {
    return (
        <div className='controls'>
            <label className='label'>
                Mouse Activation Method:
                <select onChange={(e: ChangeEvent<HTMLSelectElement>) => setMouseActivation(e.target.value)}>
                    <option value={MOUSE_ACTIVATION.CLICK}>Click</option>
                    <option value={MOUSE_ACTIVATION.DOUBLE_CLICK}>Double Click</option>
                </select>
                <div className='note'>{notes[mouseMethod]}</div>
            </label>

            <label className='label'>
                Touch Activation Method:
                <select onChange={(e: ChangeEvent<HTMLSelectElement>) => setTouchActivation(e.target.value)}>
                    <option value={TOUCH_ACTIVATION.TAP}>Tap</option>
                    <option value={TOUCH_ACTIVATION.DOUBLE_TAP}>Double Tap</option>
                    <option value={TOUCH_ACTIVATION.LONG_TOUCH}>Long Touch</option>
                </select>
                <div className='note'>{notes[touchMethod]}</div>
            </label>

            <label>
                Center on Activation Position:
                <select
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setCenterItemOnActivatePos(Boolean(e.target.value))
                    }
                >
                    <option value='true'>True</option>
                    <option value=''>False</option>
                </select>
            </label>
        </div>
    )
}

const notes = {
    [MOUSE_ACTIVATION.CLICK]: 'Click to zoom in/out',
    [MOUSE_ACTIVATION.DOUBLE_CLICK]: 'Double click to zoom in/out.',
    [TOUCH_ACTIVATION.TAP]: 'Tap to zoom in/out.',
    [TOUCH_ACTIVATION.DOUBLE_TAP]: 'Double tap to zoom in/out.',
    [TOUCH_ACTIVATION.LONG_TOUCH]: 'Touch for 1 second without moving to zoom in/out.',
}

export default ImageExampleControls

import { Dispatch, SetStateAction } from 'react'
import { MOUSE_ACTIVATION, TOUCH_ACTIVATION } from 'react-input-position-ts'

const notes = {
    [MOUSE_ACTIVATION.CLICK]: 'Click to activate',
    [MOUSE_ACTIVATION.DOUBLE_CLICK]: 'Double click to activate.',
    [MOUSE_ACTIVATION.HOVER]: 'Hover to activate.',
    [MOUSE_ACTIVATION.MOUSE_DOWN]: 'Click and hold to activate',
    [TOUCH_ACTIVATION.TAP]: 'Tap to activate.',
    [TOUCH_ACTIVATION.TOUCH]: 'Touch to activate.',
    [TOUCH_ACTIVATION.DOUBLE_TAP]: 'Double tap to activate.',
    [TOUCH_ACTIVATION.LONG_TOUCH]: 'Touch for 1 second without moving to activate.',
}

export default function PropsExampleControls({
    setMouseActivation,
    setTouchActivation,
    setTrackPassivePosition,
    setTrackPreviousPosition,
    setTrackItemPosition,
    mouseMethod,
    touchMethod,
}: {
    setMouseActivation: Dispatch<SetStateAction<string>>
    setTouchActivation: Dispatch<SetStateAction<string>>
    setTrackPassivePosition: Dispatch<SetStateAction<boolean>>
    setTrackPreviousPosition: Dispatch<SetStateAction<boolean>>
    setTrackItemPosition: Dispatch<SetStateAction<boolean>>
    mouseMethod: string
    touchMethod: string
}) {
    return (
        <div className='controls'>
            <label className='label'>
                Mouse Activation Method:
                <select onChange={(e) => setMouseActivation(e.target.value)}>
                    <option value={MOUSE_ACTIVATION.CLICK}>Click</option>
                    <option value={MOUSE_ACTIVATION.DOUBLE_CLICK}>Double Click</option>
                    <option value={MOUSE_ACTIVATION.HOVER}>Hover</option>
                    <option value={MOUSE_ACTIVATION.MOUSE_DOWN}>Mouse Down</option>
                </select>
                <div className='note'>{notes[mouseMethod]}</div>
            </label>

            <label className='label'>
                Touch Activation Method:
                <select onChange={(e) => setTouchActivation(e.target.value)}>
                    <option value={TOUCH_ACTIVATION.TAP}>Tap</option>
                    <option value={TOUCH_ACTIVATION.DOUBLE_TAP}>Double Tap</option>
                    <option value={TOUCH_ACTIVATION.TOUCH}>Touch</option>
                    <option value={TOUCH_ACTIVATION.LONG_TOUCH}>Long Touch</option>
                </select>
                <div className='note'>{notes[touchMethod]}</div>
            </label>
            <div className='label-flex'>
                <label className='label-left'>
                    Track Previous
                    <select defaultValue='' onChange={(e) => setTrackPreviousPosition(Boolean(e.target.value))}>
                        <option value='true'>True</option>
                        <option value=''>False</option>
                    </select>
                </label>

                <label className='label-right'>
                    Track Passive
                    <select defaultValue='true' onChange={(e) => setTrackPassivePosition(Boolean(e.target.value))}>
                        <option value='true'>True</option>
                        <option value=''>False</option>
                    </select>
                </label>
            </div>

            <label className='label'>
                Track Item Position
                <select defaultValue='' onChange={(e) => setTrackItemPosition(Boolean(e.target.value))}>
                    <option value='true'>True</option>
                    <option value=''>False</option>
                </select>
                <div className='note'>Click/touch and drag while active to move item.</div>
            </label>
        </div>
    )
}

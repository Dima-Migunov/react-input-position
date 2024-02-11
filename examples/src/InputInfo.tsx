import { Position, Dimensions, Offset } from 'react-input-position-ts/types'

const InputInfo = ({
    active = false,
    activePosition = { x: 0, y: 0 },
    prevActivePosition = { x: 0, y: 0 },
    passivePosition = { x: 0, y: 0 },
    elementDimensions = { width: 0, height: 0 },
    elementOffset = { top: 0, left: 0 },
    itemPosition = { x: 0, y: 0 },
}: {
    active?: boolean
    activePosition?: Position
    prevActivePosition?: Position
    passivePosition?: Position
    elementDimensions?: Dimensions
    elementOffset?: Offset
    itemPosition?: Position
}) => (
    <div className={`input-info ${active ? 'color-active' : ''}`}>
        <div>Active: {active.toString()}</div>
        <div>
            Active Position X: {activePosition.x}
            <br />
            Active Position Y: {activePosition.y}
        </div>
        <div>
            Previous Active Position X: {prevActivePosition.x}
            <br />
            Previous Active Position Y: {prevActivePosition.y}
        </div>
        <div>
            Passive Position X: {passivePosition.x}
            <br />
            Passive Position Y: {passivePosition.y}
        </div>
        <div>
            Element Width: {elementDimensions.width}
            <br />
            Element Height: {elementDimensions.height}
        </div>
        <div>
            Element Offset Left: {elementOffset.left}
            <br />
            Element Offset Top: {elementOffset.top}
        </div>
        <div>
            Item Position X: {itemPosition.x}
            <br />
            Item Position Y: {itemPosition.y}
        </div>
    </div>
)

export default InputInfo

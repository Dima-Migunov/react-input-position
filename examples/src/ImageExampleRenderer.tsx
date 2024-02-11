import React from 'react'
import image from './sample-image.jpg'

const ImageExampleRenderer = (props: any) => {
    return (
        <React.Fragment>
            <img src={image} alt='Tiger' className={`small-image ${props.active ? '' : 'show'}`} />
            <img
                ref={props.itemRef}
                src={image}
                alt='Magnified Tiger'
                style={{
                    transform: `translate(${props.itemPosition.x}px, ${props.itemPosition.y}px)`,
                }}
                className='large-image'
            />
        </React.Fragment>
    )
}

export default ImageExampleRenderer

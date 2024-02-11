import React from 'react'
import Header from './Header'
import ExampleContainer from './ExampleContainer'
import PropsExample from './PropsExample'
import ImageExample from './ImageExample'

import './style.css'

export default function App() {
    return (
        <React.Fragment>
            <Header />
            <div className='app'>
                <ExampleContainer title='Basic Demo'>
                    <PropsExample />
                </ExampleContainer>

                <ExampleContainer title='Example Usage'>
                    <ImageExample />
                </ExampleContainer>
            </div>
        </React.Fragment>
    )
}

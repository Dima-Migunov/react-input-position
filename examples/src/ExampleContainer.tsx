import { ReactNode } from 'react'

export default function ExampleContainer({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className='example-container'>
            <h2>{title}</h2>
            {children}
        </div>
    )
}

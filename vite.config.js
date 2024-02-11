import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default {
    build: {
        lib: {
            entry: [resolve(__dirname, 'src/index.tsx'), resolve(__dirname, 'src/types.ts')],
            name: 'react-input-position-ts',
            fileName: (format, name) => {
                return format === 'es' ? `${name}.js` : `${name}.${format}`
            },
        },
    },
    plugins: [dts()],
}

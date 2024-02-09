import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default {
    build: {
        lib: {
            entry: [resolve(__dirname, 'src/index.tsx')],
            name: 'react-input-position',
            fileName: (format, name) => {
                return format === 'es' ? `${name}.js` : `${name}.${format}`
            },
        },
    },
    plugins: [dts()],
}

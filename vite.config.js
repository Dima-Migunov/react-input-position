import { resolve } from 'path'

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
}

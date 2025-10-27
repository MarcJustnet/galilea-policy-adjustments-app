import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import Terminal from 'vite-plugin-terminal'

export default defineConfig((config) => {
    const appEnv = config.mode ? loadEnv(config.mode, process.cwd()) : {}
    process.env = { ...process.env, ...appEnv }

    const isDev = config.mode === 'development' || !config.mode

    return {
        plugins: [
            react(),
            ...(isDev ? [Terminal({
                console: 'terminal',
                output: ['terminal', 'console']
            })] : [])
        ],
        resolve: {
            alias: [
                { find: '@', replacement: '/src' }
            ]
        },
        base: process.env.VITE_BASE_NAME || '/',
        server: {
            port: Number(process.env.VITE_PORT ?? 5173),
            // strictPort: true,
            host: true
        }
    }
})
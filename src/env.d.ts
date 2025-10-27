/// <reference types='vite/client' />

interface ImportMetaEnv {
    readonly VITE_VERSION: string
    readonly VITE_PORT: string
    readonly VITE_ENV: string
    readonly VITE_PROJECT_NAME: string
    readonly VITE_API_URL: string
    readonly VITE_APP_URL: string
    readonly VITE_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
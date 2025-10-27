import { newStore } from './stores'

export type AuthData<T> = T | null

export interface AuthStore<T> {
    data: AuthData<T>
    token: string
    isLogged: boolean
    authError: string
    refetch: () => void
    setRefetch: (refetch: () => void) => void
    setData: (data: AuthData<T>, token?: string) => void
    setAuthError: (authError: string) => void
    setToken: (token: string) => void
    logout: () => void
}

export type AuthStoreType<T> = <K>(selector: (state: AuthStore<T>) => K) => K

export const newAuthStore = <T>(name: string) => newStore<AuthStore<T>>((set, get) => ({
    data: null,
    token: '',
    isLogged: false,
    authError: '',
    refetch: () => { },
    setRefetch: (refetch) => { set(() => ({ refetch })) },
    setData: (data: AuthData<T>, token?: string) => {
        const newToken = token ?? get().token
        set(() => ({
            data,
            isLogged: !!data,
            authError: '',
            token: newToken
        }))
    },
    setAuthError: (authError: string) => { set(() => ({ authError })) },
    logout: () => {
        set(() => ({
            me: null,
            user_instance: null,
            token: '',
            isLogged: false,
            authError: ''
        }))
    },
    setToken: (token: string) => { set(() => ({ token })) }
}), { name })

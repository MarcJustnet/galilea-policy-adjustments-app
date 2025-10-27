import { toast } from '@justnetsystems/ui-toast'

import type { BaseModel } from '@/core/types'
import type { APIError, AuthAPI, AxiosResponse } from '@/core/ui-service'
import type { AuthStoreType } from '@/core/ui-store'

interface UseLoginProps<T extends BaseModel, M extends string> {
    useStore: AuthStoreType<T>
    field: M
    loginFn: (data: AuthAPI.Login.Request) => Promise<AxiosResponse<AuthAPI.Login.Result<T, M>>>
    loginMsalFn: (data: AuthAPI.LoginMsal.Request) => Promise<AxiosResponse<AuthAPI.LoginMsal.Result<T, M>>>
}

export const useLogin = <T extends BaseModel, M extends string>({
    useStore,
    field,
    loginFn,
    loginMsalFn
}: UseLoginProps<T, M>) => {
    const setData = useStore((state) => state.setData)
    const setAuthError = useStore((state) => state.setAuthError)
    const logout = useStore((state) => state.logout)

    const handleError = (apiError: APIError) => {
        if (apiError.status !== 401) toast(apiError.message, { type: 'error' })
        console.log('useLogin handleError', apiError)
        logout()
        setAuthError(apiError.message)
    }

    const handleSuccess = (data: T, token?: string) => {
        setData(data, token)
        setAuthError('')
    }

    const login = async (body: AuthAPI.Login.Request): Promise<boolean> => {
        try {
            const loginResult = await loginFn(body)
            handleSuccess(loginResult.data.data[field], loginResult.data.data.tokens?.accessToken)
            return true
        } catch (error: unknown) {
            handleError(error as APIError)
            return false
        }
    }

    const loginMsal = async (body: AuthAPI.LoginMsal.Request): Promise<boolean> => {
        try {
            const loginResult = await loginMsalFn(body)
            handleSuccess(loginResult.data.data[field], loginResult.data.data.tokens?.accessToken)
            return true
        } catch (error: unknown) {
            handleError(error as APIError)
            return false
        }
    }

    return { login, loginMsal }
}
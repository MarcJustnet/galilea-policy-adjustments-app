import type { BaseModel } from '@/core/types'
import type { APIError, AuthAPI, AxiosResponse } from '@/core/ui-service'
import type { AuthStoreType } from '@/core/ui-store'
import { toast } from '@justnetsystems/ui-toast'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

interface UseProfileProps<T extends BaseModel> {
    useStore: AuthStoreType<T>
    profile: () => Promise<AxiosResponse<AuthAPI.Profile.Result<T>>>
}

export const useProfile = <T extends BaseModel>({
    useStore,
    profile
}: UseProfileProps<T>) => {
    const isLogged = useStore((state) => state.isLogged)
    const token = useStore((state) => state.token)
    const setData = useStore((state) => state.setData)
    const setAuthError = useStore((state) => state.setAuthError)
    const logout = useStore((state) => state.logout)
    const setRefetch = useStore((state) => state.setRefetch)

    const { isError, isLoading, data, error, refetch } = useQuery<AxiosResponse<AuthAPI.Profile.Result<T>> | null, APIError>({
        queryKey: ['me', isLogged, token],
        queryFn: async () => (isLogged && token && token !== '') ? await profile() : null,
        retry: false
    })

    const handleError = (apiError: APIError) => {
        if (apiError.status !== 401) toast(apiError.message, { type: 'error' })
        logout()
        setAuthError(apiError.message)
    }

    const handleSuccess = (data: T, token?: string) => {
        setData(data, token)
        setAuthError('')
    }

    useEffect(() => {
        if (isLoading) return
        if (isError) handleError(error)
        else if (data) handleSuccess(data.data.data)
        else handleError({ name: 'AuthError', status: 401, message: '', errors: [], stack: '' })
    }, [isLoading, isError, data])

    useEffect(() => { setRefetch(refetch) }, [refetch])

    return null
}

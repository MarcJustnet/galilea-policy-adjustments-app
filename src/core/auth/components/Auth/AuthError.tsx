import { BaseModel } from '@/core/types'
import Message from '@/core/ui-components/Message'
import { APIError } from '@/core/ui-service'
import { CrudStore } from '@/core/ui-store'
import { useEffect } from 'react'
import { useAuthContext } from '../../context'

interface AuthErrorProps<T extends BaseModel> {
    useStore: CrudStore.Types.Table<T, APIError> | CrudStore.Types.Form<T, APIError> | CrudStore.Types.FormSimple<T, APIError> | CrudStore.Types.List<T, APIError>
    message: string
    showApiError?: boolean
}

export function AuthError<T extends BaseModel>({
    useStore,
    message = 'Error cargando',
    showApiError = false
}: AuthErrorProps<T>) {
    const { logout } = useAuthContext()
    const isError = useStore((state) => state.isError)
    const error = useStore((state) => state.error)

    useEffect(() => {
        if (isError && error && 'status' in error && error.status === 401) {
            console.log('AuthError logout due to 401 error', error)
            logout()
        }
    }, [isError, error])

    if (!isError) return null

    return <Message message={
        `${message}${showApiError && error ? `: ${error}` : ''}`
    } type='danger' />
}

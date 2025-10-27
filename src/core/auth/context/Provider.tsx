import { User } from '@/core/types/models'
import { BaseAuthServiceType } from '@/core/ui-service'
import { useAuthStore } from '../store'
import { AuthContext } from './context'
import { useLogin } from './hooks/useLogin'

interface AuthProviderProps {
    children: React.ReactNode,
    AuthService: BaseAuthServiceType<User, 'user'>
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, AuthService }) => {
    const { login, loginMsal } = useLogin<User, 'user'>({
        useStore: useAuthStore,
        field: 'user',
        loginFn: AuthService.Login,
        loginMsalFn: AuthService.LoginMsal
    })
    const logout = useAuthStore(state => state.logout)
    const me = useAuthStore(state => state.data)
    return (
        <AuthContext.Provider value={{ login, loginMsal, logout, me, Service: AuthService }}>
            {children}
        </AuthContext.Provider>
    )
}

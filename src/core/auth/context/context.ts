import type { User } from '@/core/types/models'
import type { AuthAPI, BaseAuthServiceType } from '@/core/ui-service'
import { createContext, use } from 'react'

interface AuthContextType {
    login: (body: AuthAPI.Login.Request) => Promise<boolean>
    loginMsal: (body: AuthAPI.LoginMsal.Request) => Promise<boolean>
    logout: () => void
    me: User | null
    Service: BaseAuthServiceType<User, 'user'>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
export const useAuthContext = () => use(AuthContext) as AuthContextType

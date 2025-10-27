import { AuthProvider } from '@/core/auth/context'
import { AuthService } from '@/modules/Auth/services'
import { Outlet } from 'react-router'

export const Layout: React.FC = () => {
    return (
        <AuthProvider AuthService={AuthService}>
            <Outlet />
        </AuthProvider>
    )
}

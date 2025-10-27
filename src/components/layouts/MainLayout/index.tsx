import { useProfile } from '@/core/auth/context'
import { useAuthStore } from '@/core/auth/store'
import { AuthService } from '@/modules/Auth/services'
import { Icons } from '@justnetsystems/ui-icons'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { Prompt } from './Prompt'
import { Sidebar } from './Sidebar/Sidebar'

import '@/assets/styles/layout.scss'

export const BackofficeMainLayout: React.FC = () => {
    useProfile({
        useStore: useAuthStore,
        profile: AuthService.Profile,
    })
    const navigate = useNavigate()
    const isLogged = useAuthStore((state) => state.isLogged)
    const { pathname } = useLocation()

    useEffect(() => {
        if (!isLogged) navigate('/auth/login?backUrl=' + pathname)
    }, [isLogged])

    // Determinar el subtítulo basado en la ruta actual
    const getSubtitle = () => {
        if (pathname.includes('/policies/to_adjust')) return 'Ajustes de pólizas'
        if (pathname.includes('/admin')) return 'Gestión del sistema'
        if (pathname.includes('/admin/users')) return 'Gestión de usuarios'
        if (pathname.includes('/admin/mail-senders')) return 'Remitentes de correo'
        if (pathname.includes('/admin/roles')) return 'Gestión de roles'
        if (pathname.includes('/admin/profiles')) return 'Perfiles de usuario'
        return 'Sistema de gestión'
    }

    return (
        <div className="app-layout">
            {/* Header */}
            <div className="app-header">
                <div className="app-header__branding">
                    <div className="app-header__logo">
                        <Icons.Box />
                    </div>
                    <div>
                        <h1 className="app-header__title">Regularizaciones Galilea</h1>
                        <p className="app-header__subtitle">{getSubtitle()}</p>
                    </div>
                </div>
            </div>

            <div className="app-content">
                <Sidebar />
                <main className="app-main">
                    <Outlet />
                </main>
            </div>

            <Prompt />
            {/* <Version /> */}
        </div>
    )
}

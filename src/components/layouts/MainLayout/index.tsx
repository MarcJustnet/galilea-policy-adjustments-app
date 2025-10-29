import { useProfile } from '@/core/auth/context'
import { useAuthStore } from '@/core/auth/store'
import { AuthService } from '@/modules/Auth/services'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { Prompt } from './Prompt'
import { Sidebar } from './Sidebar/Sidebar'

import '@/assets/styles/layout.scss'
import { Header } from './Header'

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

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="app-content">
                <Header />
                <main className="app-main">
                    <Outlet />
                </main>
            </div>

            <Prompt />
            {/* <Version /> */}
        </div>
    )
}

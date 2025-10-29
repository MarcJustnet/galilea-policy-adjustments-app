import { iam } from '@/config/iam'
import { checkUserPermission } from '@/core/auth/components/check'
import { useAuthContext } from '@/core/auth/context'
import { useAuthStore } from '@/core/auth/store'
import { Icons } from '@justnetsystems/ui-icons'
import { getIfActive } from '@justnetsystems/utils'
import { useRef } from 'react'
import { NavLink } from 'react-router'

interface ISidebarItem {
    to: string
    icon: React.ReactNode
    title: string
    end?: boolean
    description?: string
}

const SidebarItem: React.FC<{ item: ISidebarItem }> = ({ item }) => {
    const li = useRef<HTMLLIElement>(null)
    return (
        <li ref={li}>
            <NavLink to={item.to} end={item.end} className={getIfActive}>
                {item.icon} <span>{item.title}</span>
            </NavLink>
        </li>
    )
}

export const Sidebar: React.FC = () => {
    const me = useAuthStore((state) => state.data)
    const { logout } = useAuthContext()

    const canEnterAdmin = checkUserPermission(iam.permissions.PolicyAdjustments.Admin.HasAccess, me)

    return (
        <aside className='sidebar'>
            <div className="sidebar__branding">
                <div className="sidebar__branding__logo">
                    <img src="/logo-black.webp" alt="Regularizaciones" />
                </div>
                <h1 className="sidebar__branding__title">Regularizaciones</h1>
            </div>

            <nav className="sidebar__nav">
                <ul className="sidebar__nav__list">
                    <SidebarItem item={{
                        to: 'policies/to_adjust',
                        icon: <Icons.LinesLeaning />,
                        title: 'Ajustes de pólizas',
                    }} />
                    {canEnterAdmin && (
                        <SidebarItem item={{
                            to: 'admin',
                            icon: <Icons.Gear />,
                            title: 'Administración',
                        }} />
                    )}
                </ul>
            </nav>
            <div className="sidebar__bottom">
                <button className='sidebar__bottom__logout' onClick={logout} title='Cerrar sesión'>
                    <Icons.RightFromBracket />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}

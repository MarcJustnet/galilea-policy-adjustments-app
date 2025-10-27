import { Icons } from "@justnetsystems/ui-icons"
import { useNavigate } from "react-router"

interface AdminPageInfo {
    icon: React.FC
    title: string
    description: string
    to: string
}

interface AdminSectionProps {
    title: string
    pages: AdminPageInfo[]
}

const adminPages: AdminSectionProps[] = [
    {
        title: 'Control de usuarios',
        pages: [
            {
                icon: Icons.Users,
                title: 'Usuarios',
                description: 'Gestión de usuarios del sistema',
                to: '/admin/users'
            },
            {
                icon: Icons.Shield,
                title: 'Roles',
                description: 'Administración de roles y permisos',
                to: '/admin/roles'
            },
            {
                icon: Icons.User,
                title: 'Perfiles',
                description: 'Configuración de perfiles de usuario',
                to: '/admin/profiles'
            }
        ]
    },
    {
        title: 'Mailing',
        pages: [
            {
                icon: Icons.InboxOut,
                title: 'Mail Senders',
                description: 'Configuración de servidores de correo',
                to: '/admin/mail_senders'
            }
        ]
    }
]

export const AdminPage: React.FC = () => {
    return (
        <div className='page page--admin'>
            <div className='page__header'>
                <h1 className='page__title'>Administración</h1>
                <p className='page__subtitle'>Gestiona la configuración y ajustes del sistema</p>
            </div>
            <div className='page__content'>
                {adminPages.map((section, i) => (
                    <AdminSection key={`config section ${i}`} {...section} />
                ))}
            </div>
        </div>
    )
}

const AdminSection: React.FC<AdminSectionProps> = ({ title, pages }) => {
    return (
        <div className='admin-section'>
            <h2 className='admin-section__title'>{title}</h2>
            <div className='admin-section__grid'>
                {pages.map((page, i) => (
                    <AdminCard key={`admin card ${title} ${i}`} info={page} />
                ))}
            </div>
        </div>
    )
}

interface AdminCardProps {
    info: AdminPageInfo
}

const AdminCard: React.FC<AdminCardProps> = ({
    info: { icon: Icon, title, description, to }
}) => {
    const navigate = useNavigate()
    const onClick = () => {
        navigate(to)
    }

    return (
        <div className='admin-card' onClick={onClick}>
            <div className='admin-card__icon'>
                <Icon />
            </div>
            <div className='admin-card__content'>
                <h3 className='admin-card__title'>{title}</h3>
                <p className='admin-card__description'>{description}</p>
            </div>
            <div className='admin-card__arrow'>
                <Icons.ChevronRight />
            </div>
        </div>
    )
}


export const Header: React.FC = () => {
    // const { pathname } = useLocation()

    // // Determinar el subtítulo basado en la ruta actual
    // const getTitle = () => {
    //     if (pathname.includes('/policies/to_adjust')) return 'Ajustes de pólizas'
    //     if (pathname.includes('/admin/users')) return 'Gestión de usuarios'
    //     if (pathname.includes('/admin/mail-senders')) return 'Remitentes de correo'
    //     if (pathname.includes('/admin/roles')) return 'Gestión de roles'
    //     if (pathname.includes('/admin/profiles')) return 'Perfiles de usuario'
    //     if (pathname.includes('/admin')) return 'Gestión del sistema'
    //     return 'Sistema de gestión'
    // }

    return (
        <div className="app-header">
            {/* <h2 className="app-header__title">{getTitle()}</h2> */}
        </div>
    )
}

import { defineAppConfig } from '@/core/config/iam'

export const appConfig = defineAppConfig({
    code: 'PolicyAdjustments',
    name: 'Regularizaciones Galilea',
    description: 'Gestión y distribución de regularizaciones',
    url: import.meta.env.VITE_APP_URL,
    isPublished: true,
    permissions: [
        { code: 'HasAccess', name: 'Access the app', errorCode: 310000 }
    ],
    features: {
        Policies: {
            code: 'Policies',
            name: 'Polizas',
            description: 'Manage policies',
            show: true,
            permissions: [
                { code: 'HasAccess', name: 'Access policies', errorCode: 311000 },
            ],
            children: {
                ToAdjust: {
                    code: 'ToAdjust',
                    name: 'Por regularizar',
                    description: 'Policies to adjust',
                    permissions: [
                        { code: 'List', name: 'Listar pólizas por regularizar', errorCode: 311100 },
                        { code: 'EnterForm', name: 'Ver póliza por regularizar', errorCode: 311101 },
                    ],
                    show: true
                }
            }
        },
        Admin: {
            code: 'Admin',
            name: 'Configuración',
            description: 'Administración de la aplicación',
            show: true,
            permissions: [
                { code: 'HasAccess', name: 'Access admin', errorCode: 312000 }
            ],
            children: {
                Users: {
                    code: 'Users',
                    name: 'Usuarios',
                    description: 'Manage app users',
                    show: true,
                    permissions: [
                        { code: 'List', name: 'Listar usuarios de la aplicación', errorCode: 312100 },
                        { code: 'Create', name: 'Crear usuario de la aplicación', errorCode: 312101 },
                        { code: 'Edit', name: 'Editar usuario de la aplicación', errorCode: 312102 },
                        { code: 'EnterForm', name: 'Ver usuario de la aplicación', errorCode: 312103 },
                        { code: 'Restore', name: 'Restaurar usuario de la aplicación', errorCode: 312104 },
                        { code: 'Delete', name: 'Eliminar usuario de la aplicación', errorCode: 312105 }
                    ]
                },
                Roles: {
                    code: 'Roles',
                    name: 'Roles',
                    description: 'Manage app roles',
                    show: true,
                    permissions: [
                        { code: 'List', name: 'Listar roles de la aplicación', errorCode: 312200 },
                        { code: 'Create', name: 'Crear rol de la aplicación', errorCode: 312201 },
                        { code: 'Edit', name: 'Editar rol de la aplicación', errorCode: 312202 },
                        { code: 'EnterForm', name: 'Ver rol de la aplicación', errorCode: 312203 },
                        { code: 'Restore', name: 'Restaurar rol de la aplicación', errorCode: 312204 },
                        { code: 'Delete', name: 'Eliminar rol de la aplicación', errorCode: 312205 }
                    ]
                },
                Profiles: {
                    code: 'Profiles',
                    name: 'Perfiles',
                    description: 'Manage app profiles',
                    show: true,
                    permissions: [
                        { code: 'List', name: 'Listar perfiles de la aplicación', errorCode: 312300 },
                        { code: 'Create', name: 'Crear perfil de la aplicación', errorCode: 312301 },
                        { code: 'Edit', name: 'Editar perfil de la aplicación', errorCode: 312302 },
                        { code: 'EnterForm', name: 'Ver perfil de la aplicación', errorCode: 312303 },
                        { code: 'Restore', name: 'Restaurar perfil de la aplicación', errorCode: 312304 },
                        { code: 'Delete', name: 'Eliminar perfil de la aplicación', errorCode: 312305 }
                    ]
                },
                Mailing: {
                    code: 'Mailing',
                    name: 'Mailing',
                    description: 'Manage app mailing',
                    show: true,
                    permissions: [
                        { code: 'HasAccess', name: 'Access mailing settings', errorCode: 312400 }
                    ],
                    children: {
                        MailSenders: {
                            code: 'MailSenders',
                            name: 'Mail Senders',
                            description: 'Manage mail senders',
                            show: true,
                            permissions: [
                                { code: 'List', name: 'List mail senders', errorCode: 312410 },
                                { code: 'Create', name: 'Create mail sender', errorCode: 312411 },
                                { code: 'Edit', name: 'Edit mail sender', errorCode: 312412 },
                                { code: 'EnterForm', name: 'View mail sender', errorCode: 312413 },
                                { code: 'Restore', name: 'Restore mail sender', errorCode: 312414 },
                                { code: 'Delete', name: 'Delete mail sender', errorCode: 312415 }
                            ]
                        }
                    }
                }
            }
        }
    },
})

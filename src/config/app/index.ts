import { defineAppConfig } from '@/core/config/iam'

export const appConfig = defineAppConfig({
    code: 'PolicyAdjustments',
    name: 'Regularizaciones',
    description: 'Gestión y distribución de regularizaciones',
    url: import.meta.env.VITE_APP_URL,
    isPublished: true,
    permissions: [
        { code: 'HasAccess', name: 'Acceso a la aplicación', errorCode: 310000 }
    ],
    features: {
        Policies: {
            code: 'Policies',
            name: 'Polizas',
            description: 'Manage policies',
            show: true,
            permissions: [
                { code: 'HasAccess', name: 'Acceso a pólizas', errorCode: 311000 },
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
                { code: 'HasAccess', name: 'Acceso a la administración', errorCode: 312000 }
            ],
            children: {
                Users: {
                    code: 'Users',
                    name: 'Usuarios',
                    description: 'Gestionar usuarios de la aplicación',
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
                    description: 'Gestionar roles de la aplicación',
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
                    description: 'Gestionar perfiles de la aplicación',
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
                    description: 'Gestionar el mailing de la aplicación',
                    show: true,
                    permissions: [
                        { code: 'HasAccess', name: 'Acceso a la configuración de mailing', errorCode: 312400 }
                    ],
                    children: {
                        MailSenders: {
                            code: 'MailSenders',
                            name: 'Mail Senders',
                            description: 'Gestionar los remitentes de correo de la aplicación',
                            show: true,
                            permissions: [
                                { code: 'List', name: 'Listar remitentes de correo', errorCode: 312410 },
                                { code: 'Create', name: 'Crear remitente de correo', errorCode: 312411 },
                                { code: 'Edit', name: 'Editar remitente de correo', errorCode: 312412 },
                                { code: 'EnterForm', name: 'Ver remitente de correo', errorCode: 312413 },
                                { code: 'Restore', name: 'Restaurar remitente de correo', errorCode: 312414 },
                                { code: 'Delete', name: 'Eliminar remitente de correo', errorCode: 312415 }
                            ]
                        }
                    }
                }
            }
        }
    },
})

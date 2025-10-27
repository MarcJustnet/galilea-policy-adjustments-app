export const LoginTokenTypes = Object.freeze({
    BACKOFFICE_PASSWORD_INIT: 'backoffice_password_init',
    BACKOFFICE_PASSWORD_RESTORE: 'backoffice_password_restore',
    PORTAL_PASSWORD_INIT: 'portal_password_init',
    PORTAL_PASSWORD_RESTORE: 'portal_password_restore'
})

export const LoginTokenTypesArray = Object.values(LoginTokenTypes)
export type LoginTokenType = typeof LoginTokenTypes[keyof typeof LoginTokenTypes]

export const LoginTokenTokenLength = 22

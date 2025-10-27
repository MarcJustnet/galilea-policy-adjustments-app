import type { BaseModel } from "../lib"
import type { SentEmail } from "../sent_email.model"
import type { User } from "../user.model"

export type LoginTokenType =
    | 'BACKOFFICE_PASSWORD_INIT'
    | 'BACKOFFICE_PASSWORD_RESET'
    | 'PORTAL_PASSWORD_INIT'
    | 'PORTAL_PASSWORD_RESET'

export interface LoginToken extends BaseModel {
    token: string
    date: Date | string
    dueDate: Date | string
    type: LoginTokenType
    used: boolean
    usedAt?: Date | string | null
    isLast: boolean
    userId?: number | null
    user?: User
    createdById?: number | null
    createdBy?: User
    sentEmails?: SentEmail[]
}

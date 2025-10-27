import type { BaseModel } from "./lib"
import type { SentEmail } from "./sent_email.model"

export interface MailSender extends BaseModel {
    name: string
    user: string
    port: number
    host: string
    pass: string
    secure?: boolean
    isDefault?: boolean
    msalClientId?: string | null
    msalClientSecret?: string | null
    msalTenantId?: string | null
    sentEmails?: SentEmail[]
}

import type { LoginToken } from "./iam/login_token.model"
import type { BaseModel } from "./lib"
import type { SentEmail } from "./sent_email.model"

import type { IPermission } from "@/config/iam"

export interface User extends BaseModel {
    email: string
    password?: string
    name: string
    msalId?: string | null
    createdLoginTokens?: LoginToken[]
    loginTokens?: LoginToken[]
    lastInvitationIsUsed?: boolean
    sentEmails?: SentEmail[]
    permissions?: IPermission[]
}
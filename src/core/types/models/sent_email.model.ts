import type { LoginToken } from "./iam/login_token.model"
import type { BaseModel } from "./lib"
import type { MailSender } from "./mail_sender.model"
import type { User } from "./user.model"

export interface SentEmailAddress {
    name?: string
    address: string
}

export interface MailAddress {
    name: string
    address: string
}

export interface MailAttachment {
    filename?: string
    content?: unknown
    path?: string
    href?: string
    contentType?: string
    contentDisposition?: string
    cid?: string
    encoding?: string
    headers?: Record<string, unknown>
    raw?: string | Buffer
}

export interface SentEmail extends BaseModel {
    from: MailAddress | string
    replyTo?: SentEmailAddress | null
    to: SentEmailAddress
    cc?: SentEmailAddress | null
    bcc?: SentEmailAddress | null
    subject?: string
    body?: string | null
    inReplyTo?: string | null
    isSent?: boolean
    isTest?: boolean
    testEmail?: string
    sentAt?: Date | string
    error?: string | null
    info?: string | null
    messageId?: string | null
    references?: string[] | null
    attachments?: MailAttachment[] | null
    template?: string | null
    context?: Record<string, unknown> | null
    userId?: number | null
    user?: User
    loginTokenId?: number | null
    loginToken?: LoginToken
    mailSenderId?: number | null
    mailSender?: MailSender
}

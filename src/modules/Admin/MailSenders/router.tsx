import { iam } from "@/config/iam"
import { Access } from "@/core/auth/components/Access"
import { RouteObject } from "react-router"
import { MailSenderPage, MailSendersPage } from "./views"

export const MailSendersRouter: RouteObject = {
    path: 'mail_senders',
    children: [
        {
            path: '',
            element: (
                <Access permission={iam.permissions.PolicyAdjustments.Admin.Mailing.MailSenders.List}>
                    <MailSendersPage />
                </Access>
            ),
            children: [
                {
                    path: ':id',
                    element: (
                        <Access permission={iam.permissions.PolicyAdjustments.Admin.Mailing.MailSenders.EnterForm}>
                            <MailSenderPage />
                        </Access>
                    ),
                }
            ]
        }
    ]
}

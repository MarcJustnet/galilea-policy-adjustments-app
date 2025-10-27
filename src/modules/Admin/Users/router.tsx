import { iam } from "@/config/iam"
import { Access } from "@/core/auth/components/Access"
import { RouteObject } from "react-router"
import { UserPage, UsersPage } from "./views"

export const UsersRouter: RouteObject = {
    path: 'users',
    children: [
        {
            path: '',
            element: (
                <Access permission={iam.permissions.PolicyAdjustments.Admin.Users.List}>
                    <UsersPage />
                </Access>
            ),
            children: [
                {
                    path: ':id',
                    element: (
                        <Access permission={iam.permissions.PolicyAdjustments.Admin.Users.EnterForm}>
                            <UserPage />
                        </Access>
                    ),
                }
            ]
        }
    ]
}
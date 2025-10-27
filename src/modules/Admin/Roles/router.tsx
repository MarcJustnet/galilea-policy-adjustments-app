import { iam } from "@/config/iam"
import { Access } from "@/core/auth/components/Access"
import { RouteObject } from "react-router"
import { RolePage, RolesPage } from "./views"

export const RolesRouter: RouteObject = {
    path: 'roles',
    children: [
        {
            path: '',
            element: (
                <Access permission={iam.permissions.PolicyAdjustments.Admin.Roles.List}>
                    <RolesPage />
                </Access>
            ),
            children: [
                {
                    path: ':id',
                    element: (
                        <Access permission={iam.permissions.PolicyAdjustments.Admin.Roles.EnterForm}>
                            <RolePage />
                        </Access>
                    ),
                }
            ]
        }
    ]
}

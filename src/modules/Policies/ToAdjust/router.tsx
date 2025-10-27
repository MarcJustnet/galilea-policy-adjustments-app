import { iam } from "@/config/iam"
import { Access } from "@/core/auth/components/Access"
import { RouteObject } from "react-router"
import { PoliciesPage, PolicyPage } from "./views"

export const ToAdjustRouter: RouteObject = {
    path: 'to_adjust',
    children: [
        {
            path: '',
            element: (
                <Access permission={iam.permissions.PolicyAdjustments.Policies.ToAdjust.List}>
                    <PoliciesPage />
                </Access>
            ),
            children: [
                {
                    path: ':id',
                    element: (
                        <Access permission={iam.permissions.PolicyAdjustments.Policies.ToAdjust.EnterForm}>
                            <PolicyPage />
                        </Access>
                    ),
                }
            ]
        }
    ]
}

import { iam } from "@/config/iam"
import { Access } from "@/core/auth/components/Access"
import { RouteObject } from "react-router"
import { ProfilePage, ProfilesPage } from "./views"

export const ProfilesRouter: RouteObject = {
    path: 'profiles',
    children: [
        {
            path: '',
            element: (
                <Access permission={iam.permissions.PolicyAdjustments.Admin.Profiles.List}>
                    <ProfilesPage />
                </Access>
            ),
            children: [
                {
                    path: ':id',
                    element: (
                        <Access permission={iam.permissions.PolicyAdjustments.Admin.Profiles.EnterForm}>
                            <ProfilePage />
                        </Access>
                    ),
                }
            ]
        }
    ]
}

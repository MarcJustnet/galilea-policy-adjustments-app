import type { IPermission } from "@/config/iam"
import type { User } from "@/core/types/models"

export const checkUserPermission = (permission: IPermission, me: User | null | undefined) => {
    return me?.permissions?.includes(permission)
}
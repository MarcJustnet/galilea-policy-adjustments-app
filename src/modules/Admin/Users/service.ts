import { PolicyAdjustments } from "@/config/api"
import type { Permission } from "@/core/types/models/permission.model"
import type { Profile } from "@/core/types/models/profile.model"
import type { Role } from "@/core/types/models/role.model"
import type { User } from "@/core/types/models/user.model"
import { BaseCrudService } from "@/core/ui-service"
import type { ServiceResponse } from "@/core/ui-service"

namespace UsersService {
    export namespace Invite {
        export interface Response {
            message: string
        }
    }

    export namespace PasswordRestore {
        export interface Response {
            message: string
        }
    }

    export namespace PasswordUpdate {
        export interface Request {
            password: string
            confirmPassword: string
        }

        export interface Response {
            message: string
        }
    }

    export namespace Roles {
        export interface GetResponse {
            roles: Role[]
        }
        export interface AddResponse {
            message: string
        }
        export interface AddBulkResponse {
            message: string
            added: number
            skipped: number
        }
        export interface RemoveResponse {
            message: string
        }
        export interface RemoveBulkResponse {
            message: string
            removed: number
        }
    }

    export namespace Profiles {
        export interface GetResponse {
            profiles: Profile[]
        }
        export interface AddResponse {
            message: string
        }
        export interface AddBulkResponse {
            message: string
            added: number
            skipped: number
        }
        export interface RemoveResponse {
            message: string
        }
        export interface RemoveBulkResponse {
            message: string
            removed: number
        }
    }

    export namespace Permissions {
        export interface GetResponse {
            permissions: Permission[]
        }
        export interface AddResponse {
            message: string
        }
        export interface AddBulkResponse {
            message: string
            added: number
            skipped: number
        }
        export interface RemoveResponse {
            message: string
        }
        export interface RemoveBulkResponse {
            message: string
            removed: number
        }
    }
}

export class UsersService extends BaseCrudService<User>(PolicyAdjustments, 'admin/users') {
    /**
     * Send invitation email to user
     */
    static async Invite(id: number): ServiceResponse<UsersService.Invite.Response> {
        return await PolicyAdjustments.instance.get<UsersService.Invite.Response>(`${this.baseURL}/${id}/invite`)
    }

    /**
     * Send password restore email to user
     */
    static async PasswordRestore(id: number): ServiceResponse<UsersService.PasswordRestore.Response> {
        return await PolicyAdjustments.instance.get<UsersService.PasswordRestore.Response>(`${this.baseURL}/${id}/password_restore`)
    }

    /**
     * Update user password
     */
    static async PasswordUpdate(id: number, data: UsersService.PasswordUpdate.Request): ServiceResponse<UsersService.PasswordUpdate.Response> {
        return await PolicyAdjustments.instance.patch<UsersService.PasswordUpdate.Response>(`${this.baseURL}/${id}/password_update`, data)
    }

    // === ROLES ===
    static async GetRoles(userId: number): ServiceResponse<UsersService.Roles.GetResponse> {
        return await PolicyAdjustments.instance.get<UsersService.Roles.GetResponse>(`${this.baseURL}/${userId}/roles`)
    }

    static async AddRole(userId: number, roleId: number): ServiceResponse<UsersService.Roles.AddResponse> {
        return await PolicyAdjustments.instance.post<UsersService.Roles.AddResponse>(`${this.baseURL}/${userId}/roles`, { roleId })
    }

    static async AddRoles(userId: number, roleIds: number[]): ServiceResponse<UsersService.Roles.AddBulkResponse> {
        return await PolicyAdjustments.instance.post<UsersService.Roles.AddBulkResponse>(`${this.baseURL}/${userId}/roles/bulk`, { roleIds })
    }

    static async RemoveRole(userId: number, roleId: number): ServiceResponse<UsersService.Roles.RemoveResponse> {
        return await PolicyAdjustments.instance.delete<UsersService.Roles.RemoveResponse>(`${this.baseURL}/${userId}/roles/${roleId}`)
    }

    static async RemoveRoles(userId: number, roleIds: number[]): ServiceResponse<UsersService.Roles.RemoveBulkResponse> {
        return await PolicyAdjustments.instance.delete<UsersService.Roles.RemoveBulkResponse>(`${this.baseURL}/${userId}/roles/bulk`, { data: { roleIds } })
    }

    // === PROFILES ===
    static async GetProfiles(userId: number): ServiceResponse<UsersService.Profiles.GetResponse> {
        return await PolicyAdjustments.instance.get<UsersService.Profiles.GetResponse>(`${this.baseURL}/${userId}/profiles`)
    }

    static async AddProfile(userId: number, profileId: number): ServiceResponse<UsersService.Profiles.AddResponse> {
        return await PolicyAdjustments.instance.post<UsersService.Profiles.AddResponse>(`${this.baseURL}/${userId}/profiles`, { profileId })
    }

    static async AddProfiles(userId: number, profileIds: number[]): ServiceResponse<UsersService.Profiles.AddBulkResponse> {
        return await PolicyAdjustments.instance.post<UsersService.Profiles.AddBulkResponse>(`${this.baseURL}/${userId}/profiles/bulk`, { profileIds })
    }

    static async RemoveProfile(userId: number, profileId: number): ServiceResponse<UsersService.Profiles.RemoveResponse> {
        return await PolicyAdjustments.instance.delete<UsersService.Profiles.RemoveResponse>(`${this.baseURL}/${userId}/profiles/${profileId}`)
    }

    static async RemoveProfiles(userId: number, profileIds: number[]): ServiceResponse<UsersService.Profiles.RemoveBulkResponse> {
        return await PolicyAdjustments.instance.delete<UsersService.Profiles.RemoveBulkResponse>(`${this.baseURL}/${userId}/profiles/bulk`, { data: { profileIds } })
    }

    // === PERMISSIONS ===
    static async GetPermissions(userId: number): ServiceResponse<UsersService.Permissions.GetResponse> {
        return await PolicyAdjustments.instance.get<UsersService.Permissions.GetResponse>(`${this.baseURL}/${userId}/permissions`)
    }

    static async AddPermission(userId: number, permissionId: number): ServiceResponse<UsersService.Permissions.AddResponse> {
        return await PolicyAdjustments.instance.post<UsersService.Permissions.AddResponse>(`${this.baseURL}/${userId}/permissions`, { permissionId })
    }

    static async AddPermissions(userId: number, permissionIds: number[]): ServiceResponse<UsersService.Permissions.AddBulkResponse> {
        return await PolicyAdjustments.instance.post<UsersService.Permissions.AddBulkResponse>(`${this.baseURL}/${userId}/permissions/bulk`, { permissionIds })
    }

    static async RemovePermission(userId: number, permissionId: number): ServiceResponse<UsersService.Permissions.RemoveResponse> {
        return await PolicyAdjustments.instance.delete<UsersService.Permissions.RemoveResponse>(`${this.baseURL}/${userId}/permissions/${permissionId}`)
    }

    static async RemovePermissions(userId: number, permissionIds: number[]): ServiceResponse<UsersService.Permissions.RemoveBulkResponse> {
        return await PolicyAdjustments.instance.delete<UsersService.Permissions.RemoveBulkResponse>(`${this.baseURL}/${userId}/permissions/bulk`, { data: { permissionIds } })
    }
}

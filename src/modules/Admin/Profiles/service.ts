import { PolicyAdjustments } from "@/config/api"
import type { Profile } from "@/core/types/models/profile.model"
import type { Role } from "@/core/types/models/role.model"
import { BaseCrudService } from "@/core/ui-service"
import type { ServiceResponse } from "@/core/ui-service"

namespace ProfilesService {
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
}

export class ProfilesService extends BaseCrudService<Profile>(PolicyAdjustments, 'admin/profiles') {
    // === ROLES ===
    static async GetRoles(profileId: number): ServiceResponse<ProfilesService.Roles.GetResponse> {
        return await PolicyAdjustments.instance.get<ProfilesService.Roles.GetResponse>(`${this.baseURL}/${profileId}/roles`)
    }

    static async AddRole(profileId: number, roleId: number): ServiceResponse<ProfilesService.Roles.AddResponse> {
        return await PolicyAdjustments.instance.post<ProfilesService.Roles.AddResponse>(`${this.baseURL}/${profileId}/roles`, { roleId })
    }

    static async AddRoles(profileId: number, roleIds: number[]): ServiceResponse<ProfilesService.Roles.AddBulkResponse> {
        return await PolicyAdjustments.instance.post<ProfilesService.Roles.AddBulkResponse>(`${this.baseURL}/${profileId}/roles/bulk`, { roleIds })
    }

    static async RemoveRole(profileId: number, roleId: number): ServiceResponse<ProfilesService.Roles.RemoveResponse> {
        return await PolicyAdjustments.instance.delete<ProfilesService.Roles.RemoveResponse>(`${this.baseURL}/${profileId}/roles/${roleId}`)
    }

    static async RemoveRoles(profileId: number, roleIds: number[]): ServiceResponse<ProfilesService.Roles.RemoveBulkResponse> {
        return await PolicyAdjustments.instance.delete<ProfilesService.Roles.RemoveBulkResponse>(`${this.baseURL}/${profileId}/roles/bulk`, { data: { roleIds } })
    }
}

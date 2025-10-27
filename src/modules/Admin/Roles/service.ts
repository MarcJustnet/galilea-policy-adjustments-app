import { PolicyAdjustments } from "@/config/api"
import type { Permission } from "@/core/types/models/permission.model"
import type { Role } from "@/core/types/models/role.model"
import { BaseCrudService } from "@/core/ui-service"
import type { ServiceResponse } from "@/core/ui-service"

namespace RolesService {
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

export class RolesService extends BaseCrudService<Role>(PolicyAdjustments, 'admin/roles') {
    // === PERMISSIONS ===
    static async GetPermissions(roleId: number): ServiceResponse<RolesService.Permissions.GetResponse> {
        return await PolicyAdjustments.instance.get<RolesService.Permissions.GetResponse>(`${this.baseURL}/${roleId}/permissions`)
    }

    static async AddPermission(roleId: number, permissionId: number): ServiceResponse<RolesService.Permissions.AddResponse> {
        return await PolicyAdjustments.instance.post<RolesService.Permissions.AddResponse>(`${this.baseURL}/${roleId}/permissions`, { permissionId })
    }

    static async AddPermissions(roleId: number, permissionIds: number[]): ServiceResponse<RolesService.Permissions.AddBulkResponse> {
        return await PolicyAdjustments.instance.post<RolesService.Permissions.AddBulkResponse>(`${this.baseURL}/${roleId}/permissions/bulk`, { permissionIds })
    }

    static async RemovePermission(roleId: number, permissionId: number): ServiceResponse<RolesService.Permissions.RemoveResponse> {
        return await PolicyAdjustments.instance.delete<RolesService.Permissions.RemoveResponse>(`${this.baseURL}/${roleId}/permissions/${permissionId}`)
    }

    static async RemovePermissions(roleId: number, permissionIds: number[]): ServiceResponse<RolesService.Permissions.RemoveBulkResponse> {
        return await PolicyAdjustments.instance.delete<RolesService.Permissions.RemoveBulkResponse>(`${this.baseURL}/${roleId}/permissions/bulk`, { data: { permissionIds } })
    }
}

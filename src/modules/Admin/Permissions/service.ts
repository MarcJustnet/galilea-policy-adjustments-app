import { PolicyAdjustments } from "@/config/api"
import type { Permission } from "@/core/types/models/permission.model"
import type { ServiceResponse } from "@/core/ui-service"
import { BaseCrudService } from "@/core/ui-service"

export namespace PermissionsService {
    export namespace GetListToAssign {
        interface FeatureWithPermissions {
            id: number
            name: string
            permissions: Permission[]
            parentId: number | null
            children: FeatureWithPermissions[]
        }

        export interface Response {
            status: number
            data: FeatureWithPermissions[]
        }
    }
}

export class PermissionsService extends BaseCrudService<Permission>(PolicyAdjustments, 'admin/permissions') {
    static async GetListToAssign(): ServiceResponse<PermissionsService.GetListToAssign.Response> {
        return await PolicyAdjustments.instance.get<PermissionsService.GetListToAssign.Response>(`${this.baseURL}/list_to_assign`)
    }
}

import { RolesService } from "./service"
import { RolesStore } from "./store"

import type { Role } from "@/core/types/models/role.model"
import { BaseCrudHooks } from "@/core/ui-datahooks"

export class RolesHooks extends BaseCrudHooks<Role>(RolesService, RolesStore, {
    key: 'Role',
    GetByIdSimple: {
        baseData: {
            id: 0,
            code: '',
            name: '',
            isSystemRole: false,
            description: null,
            appId: null,
            featureId: null,
            isDeleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deleteDate: null,
            restoreDate: null
        }
    }
}) { }

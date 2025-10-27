import { ProfilesService } from "./service"
import { ProfilesStore } from "./store"

import type { Profile } from "@/core/types/models/profile.model"
import { BaseCrudHooks } from "@/core/ui-datahooks"

export class ProfilesHooks extends BaseCrudHooks<Profile>(ProfilesService, ProfilesStore, {
    key: 'Profile',
    GetByIdSimple: {
        baseData: {
            id: 0,
            name: '',
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

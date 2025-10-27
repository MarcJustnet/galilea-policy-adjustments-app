import { UsersService } from "./service"
import { UsersStore } from "./store"

import type { User } from "@/core/types/models/user.model"
import { BaseCrudHooks } from "@/core/ui-datahooks"

export class UsersHooks extends BaseCrudHooks<User>(UsersService, UsersStore, {
    key: 'User',
    GetByIdSimple: {
        baseData: {
            id: 0,
            email: '',
            name: ''
        }
    }
}) { }
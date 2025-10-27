import type { Role } from "@/core/types/models/role.model"
import { BaseCrudStore } from "@/core/ui-store"

export class RolesStore extends BaseCrudStore<Role>() { }

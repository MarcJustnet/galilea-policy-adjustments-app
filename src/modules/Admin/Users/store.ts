import type { User } from "@/core/types/models"
import { BaseCrudStore } from "@/core/ui-store"

export class UsersStore extends BaseCrudStore<User>() { }
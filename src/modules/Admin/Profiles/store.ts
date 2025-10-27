import type { Profile } from "@/core/types/models/profile.model"
import { BaseCrudStore } from "@/core/ui-store"

export class ProfilesStore extends BaseCrudStore<Profile>() { }

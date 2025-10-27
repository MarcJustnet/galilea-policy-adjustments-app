import type { User } from "@/core/types/models"
import { newAuthStore } from "@/core/ui-store"

export const useAuthStore = newAuthStore<User>('policy_adjustments_auth_store')
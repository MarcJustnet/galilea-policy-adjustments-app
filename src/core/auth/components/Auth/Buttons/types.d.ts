import type { User } from "@/core/types/models"
import type { UsersService } from "@/modules/Admin/Users/service"

export interface InviteButtonProps {
    short?: boolean
    data: User
    Service: typeof UsersService
}

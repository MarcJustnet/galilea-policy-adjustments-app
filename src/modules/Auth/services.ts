import { PolicyAdjustments } from "@/config/api"
import { User } from "@/core/types/models"
import { BaseAuthService } from "@/core/ui-service"

export class AuthService extends BaseAuthService<User>(PolicyAdjustments, '/auth') { }
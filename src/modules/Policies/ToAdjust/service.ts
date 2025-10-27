import { PolicyAdjustments } from "@/config/api"
import type { PolicyFields } from "@/core/types/models/policy.model"
import { BaseCrudService } from "@/core/ui-service"

class PoliciesToAdjustService extends BaseCrudService<PolicyFields>(PolicyAdjustments, 'policies/to_adjust') {
}

export default PoliciesToAdjustService

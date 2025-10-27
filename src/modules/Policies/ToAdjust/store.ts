import type { PolicyFields } from "@/core/types/models/policy.model"
import { BaseCrudStore } from "@/core/ui-store"

export class PoliciesToAdjustStore extends BaseCrudStore<PolicyFields>({
    Table: {
        baseOrder: [['NUMERO', 'DESC']]
    }
}) { }

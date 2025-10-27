import { API } from "@/core/ui-service"

export const PolicyAdjustments = new API({
    app: 'policy_adjustments_api',
    baseURL: (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8510') + '/backoffice',
    storeKey: 'policy_adjustments_auth_store'
})
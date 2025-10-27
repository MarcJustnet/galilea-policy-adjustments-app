import type { BaseModel } from "./lib"

export interface Role extends BaseModel {
    id: number
    code: string
    name: string
    isSystemRole: boolean
    description: string | null
    appId: number | null
    featureId: number | null
}

import type { BaseModel } from "./lib"

export interface Permission extends BaseModel {
    code: string
    name: string
    description: string | null
    errorCode: number
    appId: number | null
    featureId: number | null
}

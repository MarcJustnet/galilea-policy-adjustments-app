import type { BaseModel } from "./lib"

export interface Profile extends BaseModel {
    id: number
    name: string
    description: string | null
    appId: number | null
    featureId: number | null
}

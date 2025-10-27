import type { BaseModel } from "./lib"

export interface InventoryLine extends BaseModel {
    location: string
    qrText: string
    reference: string
    variant: string
    batch: string
    quantityPerBox: number
    numberOfBoxes: number
    remainder: number
}

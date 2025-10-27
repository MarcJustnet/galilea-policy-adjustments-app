export type UUID = `${string}-${string}-${string}-${string}-${string}`

export interface BaseModel {
    id: number
    uuid?: UUID
    createdAt?: Date | string
    updatedAt?: Date | string
    isDeleted?: boolean
    deleteDate?: string | null
    restoreDate?: string | null
}

export interface Sortable {
    order?: number
}

export interface FileBase extends BaseModel {
    name: string
    formattedName?: string
    savedName?: string
    path?: string
    url?: string
    type?: string
    size?: number
    lastModified?: Date | string
    extension?: string
}

export type KeyOfType<T, M = string | number | boolean | Date | null | undefined> = {
    [K in keyof T]: T[K] extends M ? K : never
}[keyof T]

export type Any = string | number | boolean | Date | object | null | undefined | AnyObject | Any[]

export type OrderType = 'ASC' | 'DESC'
export type Order<T> = [KeyOfType<T>, OrderType]
export type Orders<T> = Order<T>[]

export interface AnyObject {
    [key: string]: Any
}

export interface OnChangeEvent<T = object> {
    target: {
        type?: string
        name: string
        name_string?: string
        name_obj?: string
        value: string | number | boolean | object | null | undefined
        value_string?: string | null
        obj?: T | null
        checked?: boolean
        files?: FileList | null
    }
    preventDefault?: () => void
}

export * from './models/lib'

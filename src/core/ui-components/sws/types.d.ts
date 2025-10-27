import type { BaseModel, OnChangeEvent } from '@/core/types'
import type { CrudStore } from '@/core/ui-store'

export type SelectWithSearchValue = string | number | boolean | null | undefined

export type HandleChangeType<T> = (value: SelectWithSearchValue, value_string: string, obj: T | null | undefined) => void

export interface SelectWithSearchProps<T extends BaseModel, V> {
    disabled?: boolean
    readOnly?: boolean
    nullableValue?: boolean
    nullable?: boolean
    onChange: (e: OnChangeEvent<T>) => void
    name: string
    name_string?: string
    name_obj?: string
    value: SelectWithSearchValue
    valueTitle?: string
    valueObj?: Any
    nameField?: keyof T
    valueField?: keyof T
    filters?: Partial<T>
    useSelectorStore: CrudStore.Types.List<T>
    useInfinity: InfiniteType<T>
    noSelectedTitle?: string
    noSelectedOption?: string
    ItemNode?: React.FC<{ name: string, value: V, obj?: T | null }>
    ValueNode?: React.FC<{ name: string, value: V, obj?: T | null }>
    extraOptions?: Array<Option<T>>
    just_value?: boolean
    showInput?: boolean
    autoFocus?: boolean
    style?: React.CSSProperties
    noResultOption?: Option<T>
    label?: string
    error?: string
    success?: string
    showError?: boolean
    addons?: React.ReactNode[]
    leftAddons?: React.ReactNode[]
}

export interface Option<T> {
    name: string
    value: SelectWithSearchValue
    onClick?: (e: React.MouseEvent) => void
    obj?: T | null
}

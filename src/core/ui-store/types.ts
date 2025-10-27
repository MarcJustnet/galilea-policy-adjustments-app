import type { Orders, OnChangeEvent, KeyOfType, OrderType } from "../types"

export type SetType<T> = (data: T | Partial<T> | ((state: T) => T | Partial<T>)) => void

export type StoreError = Error | null

export interface BaseStore<T, E extends StoreError = StoreError> {
    error: E | null
    setError: (error: E) => void
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
    isError: boolean
    setIsError: (isError: boolean) => void
    data: T | null
    setData: (data: T | null | ((prev: T | null) => T | null)) => void
    refetch: () => void
    setRefetch: (refetch: () => void) => void
}

export namespace CrudStore {
    export interface Rule<T, K extends keyof T = keyof T> {
        pass: (value: T[K], all: T) => boolean
        message: string
    }

    export type KeyRules<T> = { [K in keyof T]: { key: K, rules: Array<Rule<T, K>> } }[keyof T]

    export interface Validation<T> {
        key: keyof T
        isError: boolean
        error: string
    }

    export interface Paginated<T, E extends StoreError = StoreError> extends BaseStore<T[], E> {
        // Pagination Response
        totalPages: number
        totalRecords: number
        totalWithoutFilter: number
        setTotalPages: (total: number) => void
        setTotalRecords: (total: number) => void
        setTotalWithoutFilter: (total: number) => void
        // Pagination Request
        page: number
        limit: number | '*'
        filters: Partial<T>
        filter: string
        order: Orders<T>
        setPage: (page: number) => void
        setLimit: (limit: number | '*') => void
        onChangeOneFilter: <B>(e: OnChangeEvent<B>) => void
        onChangeMultipleFilters: <B>(e: OnChangeEvent<B>[]) => void
        clearFilters: () => void
        setFilter: (filter: string) => void
        setFilters: (filters: Partial<T>) => void
        onChangeFilter: <B>(e: OnChangeEvent<B>) => void
        onChangeOrder: (order: KeyOfType<T>, direction?: OrderType) => () => void
    }

    export interface Table<T, E extends StoreError = StoreError> extends Paginated<T, E> {
        selected: number | null
        setSelected: (id: number | null) => void
    }

    export interface TableInputs<T, E extends StoreError = StoreError> extends BaseStore<T[], E> {
        newData: T[] | null
        filters: Partial<T>
        isEdited: boolean
        isFiltered: boolean
        isSorted: boolean
        order: Orders<T>
        filteredIds: number[]
        isValid: boolean
        validations: Record<number, Array<Validation<T>>>
        onChangeFilter: <B>(e: OnChangeEvent<B>) => void
        clearFilters: () => void
        onChangeOrder: (order: keyof T) => () => void
        setNewData: (data: T[] | null | ((prev: T[] | null) => T[] | null)) => void
        sort: (a: T, b: T) => number
        setIsEdited: (isEdited: boolean) => void
        onChange: (index: number) => <B>(e: OnChangeEvent<B>) => void
        onChangeMultiple: (index: number) => (changes: Partial<T>) => void
        getValidationError: (i: number) => (key: keyof T) => string
    }

    export type List<T, E extends StoreError = StoreError> = Paginated<T, E>

    export interface FormSimple<T, E extends StoreError = StoreError> extends BaseStore<T, E> {
        newData: T | null
        isValid: boolean
        isEdited: boolean
        validations: Array<Validation<T>>
        getValidationError: (key: keyof T) => string
        setNewData: (data: T | ((prev: T) => T | null) | null) => void
        onChange: <B>(e: OnChangeEvent<B>) => void
        onChangeMultiple: <B>(events: OnChangeEvent<B>[]) => void
        setIsEdited: (isEdited: boolean) => void
    }

    export interface NavigationData {
        allCount: number
        filteredCount: number
        filteredIds: number[]
    }

    export type Navigation<E extends StoreError = StoreError> = BaseStore<NavigationData, E>

    export interface Form<T, E extends StoreError = StoreError> extends FormSimple<T, E> {
        allCount: number
        filteredCount: number
        filteredIds: number[]
        setAllCount: (count: number) => void
        setFilteredCount: (count: number) => void
        setFilteredIds: (ids: number[]) => void
    }

    type StoreType<BaseStore> = <K>(selector: (state: BaseStore) => K) => K

    export namespace Types {
        export type Table<T, E extends StoreError = StoreError> = StoreType<CrudStore.Table<T, E>>
        export type TableInputs<T, E extends StoreError = StoreError> = StoreType<CrudStore.TableInputs<T, E>>
        export type List<T, E extends StoreError = StoreError> = StoreType<CrudStore.List<T, E>>
        export type Form<T, E extends StoreError = StoreError> = StoreType<CrudStore.Form<T, E>>
        export type FormSimple<T, E extends StoreError = StoreError> = StoreType<CrudStore.FormSimple<T, E>>
        export type Navigation<E extends StoreError = StoreError> = StoreType<CrudStore.Navigation<E>>
    }
}

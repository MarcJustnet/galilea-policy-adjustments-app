import { updateSubobject } from '@justnetsystems/utils'

import type { Orders, OnChangeEvent, Any } from '../types'

import type { BaseStore, CrudStore, SetType, StoreError } from './types'

type Rules<T extends { id: number }> = Array<CrudStore.KeyRules<T>>

export const BaseStoreInitializers = <T extends { id: number }, E extends StoreError>() => {
    class StoreInitializers {
        static Base<T, M extends BaseStore<T, E> = BaseStore<T, E>>(set: SetType<M>, get: () => M): BaseStore<T, E> {
            return {
                data: null,
                error: null,
                isLoading: false,
                isError: false,
                refetch: () => { },
                setError: (error) => { set({ error, isError: Boolean(error) } as Partial<M>) },
                setIsLoading: (isLoading) => { set({ isLoading } as Partial<M>) },
                setIsError: (isError) => { set({ isError } as Partial<M>) },
                setData: (data) => {
                    const d = data instanceof Function ? data(get().data) : data
                    set({ data: d } as Partial<M>)
                },
                setRefetch: (refetch) => { set({ refetch } as Partial<M>) }
            }
        }

        static Paginated<M extends CrudStore.Paginated<T, E> = CrudStore.Paginated<T, E>>(baseOrder: Orders<T>, baseFilters: Partial<T> = {}) {
            return ((set: SetType<M>, get: () => M): CrudStore.Paginated<T, E> => ({
                ...this.Base<T[], M>(set, get),
                page: 1,
                totalPages: 1,
                totalRecords: 0,
                totalWithoutFilter: 0,
                limit: 25,
                filters: baseFilters,
                filter: '',
                order: baseOrder,
                setFilter: (filter) => { set({ filter } as Partial<M>) },
                setFilters: (filters) => { set({ filters } as Partial<M>) },
                onChangeFilter: (e) => {
                    set({ filter: e.target.value as string } as Partial<M>)
                },
                onChangeOneFilter: (e) => {
                    const { type, name, name_string, value_string, value, checked } = e.target
                    const val = type === 'checkbox' ? checked : value
                    const val_string = val ? value_string : undefined

                    set((prev) => {
                        const newFilters = { ...prev.filters, [name]: val, ...(name_string ? { [name_string]: val_string } : {}) }
                        const filters = Object.fromEntries(Object.entries(newFilters).filter(([, v]) => v !== '' && v !== undefined)) as Partial<T>

                        // return { filters: { ...prev.filters, [name]: val, ...(name_string ? { [name_string]: val_string } : {}) }, page: 1 }
                        return { filters, page: 1 } as Partial<M>
                    })
                },
                onChangeMultipleFilters: (events) => {
                    const toChange: Array<[string, string | number | boolean | object | null | undefined]> = []
                    for (const e of events) {
                        const { type, name, name_string, value_string, value, checked } = e.target
                        const val = type === 'checkbox' ? checked : value
                        const val_string = val ? value_string : undefined

                        toChange.push([name, val])
                        if (name_string) toChange.push([name_string, val_string])
                    }

                    set((prev) => {
                        const newFilters = { ...prev.filters, ...Object.fromEntries(toChange) }

                        const filters = Object.fromEntries(Object.entries(newFilters).filter(([, v]) => v !== '' && v !== undefined)) as Partial<T>
                        return { filters, page: 1 } as Partial<M>
                    })
                },
                clearFilters: () => {
                    set(() => ({ filters: {}, filter: '', page: 1 } as Partial<M>))
                },
                onChangeOrder: (order, direction) => () => {
                    const page = 1
                    set((prev) => {
                        const [lastOrder] = prev.order
                        const [lastKey, lastOrderType] = lastOrder

                        const base = { order: baseOrder, page } as Partial<M>

                        if (direction) {
                            if (lastKey === order && lastOrderType === direction) return base
                            return { order: [[order, direction]], page } as Partial<M>
                        } else if (lastKey === order) {
                            if (lastOrderType === 'ASC') return { order: [[order, 'DESC']], page } as Partial<M>
                            else return base
                        }
                        return { order: [[order, 'ASC']], page } as Partial<M>
                    })
                },
                setPage: (page) => { set({ page } as Partial<M>) },
                setLimit: (limit) => { set({ limit, page: 1 } as Partial<M>) },
                setTotalPages: (totalPages) => { set({ totalPages } as Partial<M>) },
                setTotalRecords: (totalRecords) => { set({ totalRecords } as Partial<M>) },
                setTotalWithoutFilter: (totalWithoutFilter) => { set({ totalWithoutFilter } as Partial<M>) },
            })).bind(this)
        }

        static Table(baseOrder: Orders<T>) {
            return ((set: SetType<CrudStore.Table<T, E>>, get: () => CrudStore.Table<T, E>): CrudStore.Table<T, E> => ({
                ...this.Paginated<CrudStore.Table<T, E>>(baseOrder)(set, get),
                selected: null,
                setSelected: (id) => { set({ selected: id }) }
            })).bind(this)
        }

        static TableInputs(baseOrder: Orders<T>, rules: Rules<T>) {
            return ((set: SetType<CrudStore.TableInputs<T, E>>, get: () => CrudStore.TableInputs<T, E>): CrudStore.TableInputs<T, E> => ({
                ...this.Base<T[], CrudStore.TableInputs<T, E>>(set, get),
                newData: null,
                isEdited: false,
                isValid: true,
                validations: [],
                isFiltered: false,
                isSorted: false,
                order: baseOrder,
                filters: {},
                filteredIds: [],
                onChangeFilter: (e) => {
                    const val = this.getVal(e.target)
                    set((prev) => this.localFilter(prev.newData, { ...prev.filters, [e.target.name]: val }))
                },
                onChangeOrder: (order) => () => {
                    const page = 1
                    set((prev) => {
                        const [lastOrder] = prev.order
                        const [lastKey, lastOrderType] = lastOrder
                        if (lastKey === order) {
                            if (lastOrderType === 'ASC') return { order: [[order, 'DESC']] as Orders<T>, isSorted: true, page }
                            else return { order: baseOrder, isSorted: false, page }
                        }
                        return { order: [[order, 'ASC']] as Orders<T>, isSorted: true, page }
                    })
                },
                clearFilters: () => { set(prev => ({ filters: {}, isFiltered: false, filteredIds: prev.newData?.map(({ id }) => id) ?? [] })) },
                getValidationError: (i) => (key) => {
                    const validation = get().validations[i]?.find((validation) => validation.key === key)
                    return validation?.error ?? ''
                },
                setData: (data) => {
                    set((prev) => {
                        const d = (data instanceof Function) ? data(prev.data) : data
                        return {
                            data: d,
                            newData: d,
                            validations: [],
                            filteredIds: d?.map(({ id }) => id),
                        }
                    })
                },
                setNewData: (newData) => {
                    if (newData) {
                        const newData2 = newData instanceof Function ? newData(get().newData) : newData
                        const validations: Record<number, Array<CrudStore.Validation<T>>> = {}
                        let isValid = true

                        if (newData2) {
                            for (let i = 0; i < newData2.length; i++) {
                                const item = newData2[i]
                                const { isValid: itemIsValid, validations: itemValidations } = this.validate(item, rules)
                                validations[i] = itemValidations
                                if (!itemIsValid) isValid = false
                            }
                        }

                        set({ newData: newData2, validations, isValid })
                    } else set({ newData })
                },
                sort: (a: T, b: T) => {
                    const { order } = get()
                    if (!order.length) return 0
                    const [key, type] = order[0]
                    if (key === '') return 0
                    const aValue = a[key as keyof T] as string | number ?? ''
                    const bValue = b[key as keyof T] as string | number ?? ''
                    if (typeof aValue === 'string' && typeof bValue === 'string') return type === 'ASC' ? aValue.localeCompare(bValue) : (bValue).localeCompare(aValue)
                    if (typeof aValue === 'number' && typeof bValue === 'number') return type === 'ASC' ? aValue - bValue : bValue - aValue
                    return 0
                },
                setIsEdited: (isEdited) => { set({ isEdited }) },
                onChange: (index) => (e) => {
                    const { setNewData } = get()
                    const changes = this.getChanges([e], true)
                    setNewData((prev) => {
                        if (!prev) return prev
                        const data = [...prev]
                        data[index] = { ...data[index], ...changes }
                        return data
                    })
                },
                onChangeMultiple: (index) => (changes) => {
                    const { setNewData } = get()
                    setNewData((prev) => {
                        if (!prev) return prev
                        const data = [...prev]
                        data[index] = { ...data[index], ...changes }
                        return data
                    })
                }
            })).bind(this)
        }

        static List(baseOrder: Orders<T>, baseFilters: Partial<T> = {}) {
            return ((set: SetType<CrudStore.List<T, E>>, get: () => CrudStore.List<T, E>): CrudStore.List<T, E> => ({
                ...this.Paginated<CrudStore.List<T, E>>(baseOrder, baseFilters)(set, get)
            })).bind(this)
        }

        static FormSimple<M extends CrudStore.FormSimple<T, E> = CrudStore.FormSimple<T, E>>(rules: Rules<T>, initialData: T | null = null) {
            return ((set: SetType<M>, get: () => M): CrudStore.FormSimple<T, E> => ({
                ...this.Base<T, M>(set, get),
                getValidationError: (key) => {
                    const validation = get().validations.find((validation) => validation.key === key)
                    return validation?.error ?? ''
                },
                isValid: true,
                isEdited: false,
                newData: initialData,
                validations: [],
                onChange: (e) => {
                    const changes = this.getChanges([e], true)
                    get().setNewData(prevNewData => ({ ...prevNewData, ...changes }))
                },
                onChangeMultiple: <B>(events: OnChangeEvent<B>[]) => {
                    const changes = this.getChanges(events, true)
                    get().setNewData(prevNewData => ({ ...prevNewData, ...changes }))
                },
                setIsEdited: (isEdited) => { set({ isEdited } as Partial<M>) },
                setNewData: (newData) => {
                    if (newData) {
                        const newData2 = newData instanceof Function ? newData(get().newData as T) : newData
                        const { validations, isValid } = this.validate(newData2, rules)
                        set({ newData: newData2, isValid, validations } as Partial<M>)
                    } else set({ newData } as Partial<M>)
                }
            })).bind(this)
        }

        static Form(rules: Rules<T>, initialData: T | null = null) {
            return ((set: SetType<CrudStore.Form<T, E>>, get: () => CrudStore.Form<T, E>): CrudStore.Form<T, E> => ({
                ...this.FormSimple<CrudStore.Form<T, E>>(rules, initialData)(set, get),
                allCount: 0,
                filteredCount: 0,
                filteredIds: [],
                setAllCount: (allCount) => { set({ allCount }) },
                setFilteredCount: (filteredCount) => { set({ filteredCount }) },
                setFilteredIds: (filteredIds) => { set({ filteredIds }) }
            })).bind(this)
        }

        static Navigation() {
            return ((set: SetType<CrudStore.Navigation<E>>, get: () => CrudStore.Navigation<E>): CrudStore.Navigation<E> => ({
                ...this.Base<CrudStore.NavigationData>(set, get)
            })).bind(this)
        }

        static getVal<T = Any>(target: OnChangeEvent<T>['target']) {
            return target.type === 'checkbox' ? target.checked : target.value
        }

        static localFilter<T extends { id: number }>(data: T[] | null, newFilters: Partial<T>): { filteredIds: number[], isFiltered: boolean, filters: Partial<T> } {
            const filters = Object.fromEntries(Object.entries(newFilters).filter(([, v]) => v !== '')) as Partial<T>
            const isFiltered = Object.values(filters).some((filter) => filter !== '')
            let filteredIds: number[] = []
            if (data) {
                if (!isFiltered) filteredIds = data.map(({ id }) => id)
                else {
                    filteredIds = data.filter((item) => {
                        return Object.entries(filters).every(([key, value]) => {
                            const field = item[key as keyof T]
                            if (typeof field === 'string') return field.toLowerCase().includes(value.toLowerCase())
                            if (typeof field === 'number') return field.toString().includes(Number(value).toString())
                            return field === value
                        })
                    }).map(({ id }) => id)
                }
            }

            return { filteredIds, isFiltered, filters }
        }

        static getChanges<B = Any>(e: OnChangeEvent<B>[], asOne: boolean = false) {
            const arr = e.map(({ target }) => {
                let change = updateSubobject({}, target.name.split('.'), this.getVal(target))
                if (target.name_string) change = updateSubobject(change, target.name_string.split('.'), target.value_string)
                if (target.name_obj && target.obj) change = updateSubobject(change, target.name_obj.split('.'), target.obj)

                return change
            })
            return asOne
                ? arr.reduce((acc, cur) => ({ ...acc, ...cur }), {})
                : arr
        }

        static validate(data: T | null, rules: Rules<T>) {
            const validations: Array<CrudStore.Validation<T>> = rules.map(({ key, rules }) => {
                const value = data![key]
                const isError = !rules.every((rule) => rule.pass(value, data!))
                return { key, isError, error: rules.find((rule) => !rule.pass(value, data!))?.message ?? '' }
            })
            const isValid = !validations.some((validation) => validation.isError)

            return { validations, isValid }
        }
    }

    return StoreInitializers
}

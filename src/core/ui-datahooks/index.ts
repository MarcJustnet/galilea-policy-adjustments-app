import { toast } from '@justnetsystems/ui-toast'
import { type MutateOptions, useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'

import { useParamId, useURL } from '@/core/ui-hooks'
import type { AxiosResponse, BaseCrudServiceType, CrudAPI } from '@/core/ui-service'
import type { BaseCrudStore, CrudStore } from '@/core/ui-store'

interface BaseCrudHooksOptions<T extends { id: number }> {
    key: string
    Table?: {
        refetchOnWindowFocus?: boolean
        refetchInterval?: number | false
        getData?: BaseCrudServiceType<T>['GetTable']
    }
    List?: {
        refetchOnWindowFocus?: boolean
        refetchOnMount?: boolean
        refetchOnReconnect?: boolean
        getData?: BaseCrudServiceType<T>['GetList']
    }
    GetByIdSimple?: {
        baseData: T
        getData?: BaseCrudServiceType<T>['GetByIdSimple']
        gcTime?: number
        navigateOnZeroTo?: string | null
        field?: string
    }
    GetById?: {
        baseData: T
        getData?: BaseCrudServiceType<T>['GetById']
        gcTime?: number
        navigateOnZeroTo?: string | null
        field?: string
        refetchOnWindowFocus?: boolean
    }
    GetByIdNavigation?: {
        getData?: BaseCrudServiceType<T>['GetByIdNavigation']
        gcTime?: number
    }
    Mutate?: {
        name?: string
        createFn?: BaseCrudServiceType<T>['Create']
        updateFn?: BaseCrudServiceType<T>['Update']
        right?: number
        left?: number
        navigateOnSuccess?: boolean
    }
}

interface MutateProps<T extends { id: number }> {
    newData: Partial<T> | T
    isNew: boolean
}

export const BaseCrudHooks = <T extends { id: number }>(
    Service: BaseCrudServiceType<T>,
    CrudStore: ReturnType<typeof BaseCrudStore<T>>,
    Options: BaseCrudHooksOptions<T>,
) => {

    const useTableHook = () => {
        const setData = CrudStore.Table(state => state.setData)
        const setIsLoading = CrudStore.Table(state => state.setIsLoading)
        const setError = CrudStore.Table(state => state.setError)
        const setTotalPages = CrudStore.Table(state => state.setTotalPages)
        const setTotalRecords = CrudStore.Table(state => state.setTotalRecords)
        const setTotalWithoutFilter = CrudStore.Table(state => state.setTotalWithoutFilter)
        const setPage = CrudStore.Table(state => state.setPage)
        const setRefetch = CrudStore.Table(state => state.setRefetch)
        const filters = CrudStore.Table(state => state.filters)
        const order = CrudStore.Table(state => state.order)
        const page = CrudStore.Table(state => state.page)
        const limit = CrudStore.Table(state => state.limit)
        const filter = CrudStore.Table(state => state.filter)

        const { isLoading, isError, data, refetch, error } = useQuery<AxiosResponse<CrudAPI.GetTable.Result<T>>, Error>({
            queryKey: ['Table', Options.key, Options.Table?.getData, Service.GetTable, page, limit, order, filters, filter],
            queryFn: async () => await (Options.Table?.getData ?? Service.GetTable)({ page, limit, order, filters, filter }),
            refetchOnWindowFocus: Options.Table?.refetchOnWindowFocus,
            refetchInterval: Options.Table?.refetchInterval,
            retry: false
        })

        useEffect(() => { setIsLoading(isLoading) }, [isLoading])
        useEffect(() => { setError(error) }, [isError, error])
        useEffect(() => { setRefetch(refetch) }, [refetch])

        useEffect(() => {
            if (!isLoading && !isError) {
                setData(data?.data?.data.data ?? [])
                setTotalPages(data?.data?.data?.totalPages ?? 0)
                setTotalRecords(data?.data?.data?.totalRecords ?? 0)
                setTotalWithoutFilter(data?.data?.data?.totalWithoutFilter ?? 0)
                setPage(data?.data?.data?.page ?? 0)
            }
        }, [data, isLoading, isError])

        return null
    }

    const useListHook = (limit: number | '*' = 10) => {
        const setData = CrudStore.List(state => state.setData)
        const setIsLoading = CrudStore.List(state => state.setIsLoading)
        const setIsError = CrudStore.List(state => state.setIsError)
        const setTotalRecords = CrudStore.List(state => state.setTotalRecords)
        const setTotalPages = CrudStore.List(state => state.setTotalPages)
        const totalRecords = CrudStore.List(state => state.totalRecords)
        const totalPages = CrudStore.List(state => state.totalPages)
        const filter = CrudStore.List(state => state.filter)
        const filters = CrudStore.List(state => state.filters)
        const result = CrudStore.List(state => state.data)
        const order = CrudStore.List(state => state.order)
        const setRefetch = CrudStore.List(state => state.setRefetch)

        const { isLoading, isError, data, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery<CrudAPI.GetList.Result<T>>({
            queryKey: [
                'List',
                Options.key,
                Options.List,
                Options.List?.getData,
                Service.GetList,
                filter,
                filters,
                order,
                limit
            ],
            queryFn: async ({ pageParam = 1 }) => {
                const response = await (Options.List?.getData ?? Service.GetList)({ page: pageParam as number, filter, filters, limit, order })
                return response.data
            },
            getNextPageParam: (lastPage) => lastPage.data.nextPage ?? undefined,
            refetchOnWindowFocus: Options.List?.refetchOnWindowFocus,
            refetchOnMount: Options.List?.refetchOnMount,
            refetchOnReconnect: Options.List?.refetchOnReconnect,
            initialPageParam: 1
        })

        useEffect(() => { setIsLoading(isLoading) }, [isLoading, setIsLoading])
        useEffect(() => { setIsError(isError) }, [isError, setIsError])
        useEffect(() => {
            setData(data?.pages.flatMap((page) => page.data.data) ?? [])
            if (data?.pages.length) {
                const lastPage = data.pages[data.pages.length - 1]
                const { totalPages, totalRecords } = lastPage.data
                setTotalRecords(totalRecords)
                setTotalPages(totalPages)
            }
        }, [data, setData, setTotalRecords, setTotalPages])

        useEffect(() => { setRefetch(refetch) }, [refetch, setRefetch])

        return {
            isLoading,
            isError,
            data: result,
            hasNextPage,
            fetchNextPage,
            isFetchingNextPage,
            refetch,
            totalRecords,
            totalPages
        }
    }

    const useGetByIdSimpleHook = () => {
        const id = useParamId({
            navigateOnZeroTo: Options.GetByIdSimple?.navigateOnZeroTo,
            field: Options.GetByIdSimple?.field || 'id'
        })

        const setData = CrudStore.FormSimple(state => state.setData)
        const setNewData = CrudStore.FormSimple(state => state.setNewData)
        const setIsLoading = CrudStore.FormSimple(state => state.setIsLoading)
        const setError = CrudStore.FormSimple(state => state.setError)
        const result = CrudStore.FormSimple(state => state.data)
        const setRefetch = CrudStore.FormSimple(state => state.setRefetch)

        // if (!Options.GetByIdSimple) throw new Error('GetByIdSimple options are not configured')

        const { isLoading, isError, data, error, refetch } = useQuery<AxiosResponse<CrudAPI.GetByIdSimple.Result<T>>, Error>({
            queryKey: [
                'GetById',
                'Simple',
                id,
                Options.key,
                Options.GetByIdSimple,
                Options.GetByIdSimple?.baseData,
                Options.GetByIdSimple?.getData,
                Service.GetByIdSimple
            ],
            queryFn: async () => {
                // if (!Options.GetByIdSimple) throw new Error('GetByIdSimple options are not configured')
                if (id === 0) {
                    return { data: { data: { data: Options.GetByIdSimple?.baseData } } } as AxiosResponse<CrudAPI.GetByIdSimple.Result<T>>
                }
                return await (Options.GetByIdSimple?.getData ?? Service.GetByIdSimple)(id)
            },
            refetchOnWindowFocus: false,
            retry: false,
            gcTime: Options.GetByIdSimple?.gcTime ?? 5 * 60 * 1000 // 5 minutos por defecto
        })

        useEffect(() => { setIsLoading(isLoading) }, [isLoading, setIsLoading])
        useEffect(() => { setError(error) }, [isError, error, setError])
        useEffect(() => {
            if (!isLoading && !isError && data) {
                setData(data.data.data.data)
                setNewData(data.data.data.data)
            }
        }, [data, isLoading, isError, setData])
        useEffect(() => { setRefetch(refetch) }, [refetch, setRefetch])

        return result
    }

    const useGetByIdHook = () => {
        const id = useParamId({
            navigateOnZeroTo: Options.GetById?.navigateOnZeroTo,
            field: Options.GetById?.field || 'id'
        })

        const setData = CrudStore.Form(state => state.setData)
        const setIsLoading = CrudStore.Form(state => state.setIsLoading)
        const setAllCount = CrudStore.Form(state => state.setAllCount)
        const setFilteredCount = CrudStore.Form(state => state.setFilteredCount)
        const setFilteredIds = CrudStore.Form(state => state.setFilteredIds)
        const setError = CrudStore.Form(state => state.setError)
        const result = CrudStore.Form(state => state.data)
        const setRefetch = CrudStore.Form(state => state.setRefetch)

        const filters = CrudStore.Table(state => state.filters)
        const order = CrudStore.Table(state => state.order)

        if (!Options.GetById) throw new Error('GetById options are not configured')

        const { isLoading, isError, data, error, refetch } = useQuery<AxiosResponse<CrudAPI.GetById.Result<T>>, Error>({
            queryKey: [
                'GetById',
                id,
                Options.key,
                Options.GetById,
                Options.GetById?.baseData,
                Options.GetById?.getData,
                Service.GetById,
                filters,
                order
            ],
            queryFn: async () => {
                if (id === 0) {
                    return {
                        data: {
                            status: 200,
                            data: {
                                data: Options.GetById?.baseData ?? {} as T,
                                allCount: 0,
                                filteredCount: 0,
                                filteredIds: []
                            }
                        },
                        status: 200,
                        statusText: 'OK'
                    } as unknown as AxiosResponse<CrudAPI.GetById.Result<T>>
                }
                return await (Options.GetById?.getData ?? Service.GetById)(id, { filters, order })
            },
            refetchOnWindowFocus: Options.GetById.refetchOnWindowFocus ?? false,
            retry: false,
            gcTime: Options.GetById.gcTime ?? 5 * 60 * 1000 // 5 minutos por defecto
        })

        useEffect(() => { setIsLoading(isLoading) }, [isLoading, setIsLoading])
        useEffect(() => { setError(error) }, [isError, error, setError])
        useEffect(() => {
            if (!isLoading && !isError && data) {
                setData(data.data.data.data)
                setAllCount(data.data.data.allCount)
                setFilteredCount(data.data.data.filteredCount)
                setFilteredIds(data.data.data.filteredIds)
            }
        }, [data, isLoading, isError, setData, setAllCount, setFilteredCount, setFilteredIds])
        useEffect(() => { setRefetch(refetch) }, [refetch, setRefetch])

        return result
    }

    const useGetByIdNavigationHook = () => {
        const setIsLoading = CrudStore.Form(state => state.setIsLoading)
        const setAllCount = CrudStore.Form(state => state.setAllCount)
        const setFilteredCount = CrudStore.Form(state => state.setFilteredCount)
        const setFilteredIds = CrudStore.Form(state => state.setFilteredIds)
        const setError = CrudStore.Form(state => state.setError)

        const filters = CrudStore.Table(state => state.filters)
        const order = CrudStore.Table(state => state.order)

        if (!Options.GetByIdNavigation) throw new Error('GetByIdNavigation options are not configured')

        const { isLoading, isError, data, error } = useQuery<AxiosResponse<CrudAPI.GetByIdNavigation.Result>, Error>({
            queryKey: [
                'GetByIdNavigation',
                Options.key,
                Options.GetByIdNavigation,
                Options.GetByIdNavigation?.getData,
                Service.GetByIdNavigation,
                filters,
                order
            ],
            queryFn: async () => await (Options.GetByIdNavigation?.getData ?? Service.GetByIdNavigation)({ filters, order }),
            refetchOnWindowFocus: false,
            retry: false,
            gcTime: Options.GetByIdNavigation.gcTime ?? 5 * 60 * 1000 // 5 minutos por defecto
        })

        useEffect(() => { setIsLoading(isLoading) }, [isLoading, setIsLoading])
        useEffect(() => { setError(error) }, [isError, error, setError])
        useEffect(() => {
            if (!isLoading && !isError && data) {
                setAllCount(data.data.data.allCount)
                setFilteredCount(data.data.data.filteredCount)
                setFilteredIds(data.data.data.filteredIds)
            }
        }, [data, isLoading, isError, setAllCount, setFilteredCount, setFilteredIds])

        return null
    }

    const useMutateBaseHook = (FormStore: CrudStore.Types.Form<T> | CrudStore.Types.FormSimple<T>) => {
        const navigate = useNavigate()

        const setData = FormStore(state => state.setData)
        const setNewData = FormStore(state => state.setNewData)

        const { getURL } = useURL({
            right: Options.Mutate?.right ?? 0,
            left: Options.Mutate?.left ?? 0
        })

        const { isPending, mutate } = useMutation<T, Error, MutateProps<T>>({
            mutationFn: async ({ newData, isNew = false }: MutateProps<T>) => {
                // setIsNew(isNew)
                if (isNew) {
                    const createFn = Options.Mutate?.createFn ?? Service.Create
                    const result = await createFn(newData as T)
                    return result.data.data
                } else {
                    const updateFn = Options.Mutate?.updateFn ?? Service.Update
                    const id = (newData as T).id
                    const result = await updateFn(id, newData)
                    return result.data.data
                }
            }
        })

        // useEffect(() => {
        //     if (!isLoading) {
        //         if (isSuccess && data) {
        //             setData(data)
        //             setNewData(data)
        //             toast(`${Options.Mutate?.name ?? 'Registro'} ${isNew ? 'creado' : 'actualizado'} correctamente`, { type: 'success' })
        //             if (isNew && (Options.Mutate?.navigateOnSuccess ?? true)) {
        //                 navigate(getURL(data.id))
        //             }
        //         }
        //         if (isError && error) {
        //             console.log('Mutation error:', error)
        //             toast(`Error al ${isNew ? 'crear' : 'actualizar'} ${Options.Mutate?.name ?? 'registro'}: ${error.message}`, { type: 'error' })
        //         }
        //     }
        // }, [isLoading, isSuccess, isError, data, error, isNew])

        const onSuccessCreate = (res: T) => {
            setData(res)
            setNewData(res)
            toast(`${Options.Mutate?.name ?? 'Registro'} creado correctamente`, { type: 'success' })
            if (Options.Mutate?.navigateOnSuccess ?? true) navigate(getURL(res.id))
        }

        const onSuccessUpdate = (res: T) => {
            setData(res)
            setNewData(res)
            toast(`${Options.Mutate?.name ?? 'Registro'} actualizado correctamente`, { type: 'success' })
        }

        const onErrorCreate = (err: unknown) => {
            toast(`Error al crear ${Options.Mutate?.name ?? 'registro'}: ${(err as Error).message}`, { type: 'error' })
        }

        const onErrorUpdate = (err: unknown) => {
            toast(`Error al actualizar ${Options.Mutate?.name ?? 'registro'}: ${(err as Error).message}`, { type: 'error' })
        }

        const create = (newData: T, options: MutateOptions<T, unknown, MutateProps<T>, unknown> = {}) => {
            if (!options.onSuccess) options.onSuccess = onSuccessCreate
            if (!options.onError) options.onError = onErrorCreate
            mutate({ newData, isNew: true }, options)
        }

        const update = (newData: Partial<T> | T, options: MutateOptions<T, unknown, MutateProps<T>, unknown> = {}) => {
            if (!options.onSuccess) options.onSuccess = onSuccessUpdate
            if (!options.onError) options.onError = onErrorUpdate
            mutate({ newData, isNew: false }, options)
        }

        return {
            create,
            update,
            isLoading: isPending
        }
    }

    const useMutateHook = () => {
        return useMutateBaseHook(CrudStore.Form)
    }

    const useMutateSimpleHook = () => {
        return useMutateBaseHook(CrudStore.FormSimple)
    }

    class BaseCrudHooksClass {
        // Estos son wrappers que llaman a las funciones hook reales
        static useTable = useTableHook
        static useList = useListHook
        static useGetByIdSimple = useGetByIdSimpleHook
        static useGetById = useGetByIdHook
        static useGetByIdNavigation = useGetByIdNavigationHook
        static useMutateBase = useMutateBaseHook
        static useMutate = useMutateHook
        static useMutateSimple = useMutateSimpleHook
    }

    return BaseCrudHooksClass
}

// Hook utility para manejar infinite scroll con refs
export type ListHookType<T extends { id: number }> = ReturnType<ReturnType<typeof BaseCrudHooks<T>>['useList']>

interface useListOnScrollRefProps<T extends { id: number }> {
    useListHook: (limit?: number | '*') => ListHookType<T>
    limit?: number | '*'
    heightOffset?: number
}

export function useListOnScrollRef<T extends { id: number }>({
    useListHook,
    limit = 10,
    heightOffset = 175
}: useListOnScrollRefProps<T>) {
    const { isLoading, data, hasNextPage, fetchNextPage, isFetchingNextPage } = useListHook(limit)

    const dropdownRef = useRef<HTMLUListElement>(null)

    const onScroll = (c: HTMLUListElement) => {
        let isThrottled = false

        return async () => {
            if (isThrottled) return
            if (!isFetchingNextPage && !isLoading && (c.scrollTop + c.clientHeight >= (c.scrollHeight - heightOffset))) {
                isThrottled = true
                setTimeout(async () => {
                    await fetchNextPage({ cancelRefetch: false })
                    isThrottled = false
                }, 200)
            }
        }
    }

    useEffect(() => {
        if (!dropdownRef.current) return
        if (hasNextPage) {
            const scrollHandler = onScroll(dropdownRef.current)
            dropdownRef.current.addEventListener('wheel', scrollHandler)
            return () => { dropdownRef.current?.removeEventListener('wheel', scrollHandler) }
        } else {
            const scrollHandler = onScroll(dropdownRef.current)
            dropdownRef.current.removeEventListener('wheel', scrollHandler)
        }
    }, [hasNextPage, isFetchingNextPage, isLoading])

    return {
        dropdownRef: dropdownRef as React.RefObject<HTMLUListElement>,
        data
    }
}

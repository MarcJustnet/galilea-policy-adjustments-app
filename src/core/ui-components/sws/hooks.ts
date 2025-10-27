import { useRef, useId, useEffect, useState } from 'react'

import type { HandleChangeType, Option, SelectWithSearchProps } from './types'

import type { BaseModel } from '@/core/types'
import { useClickOutside } from '@/core/ui-hooks'
import type { CrudStore } from '@/core/ui-store'

type UseSelectWithSearchProps<T extends BaseModel, V> = Pick<SelectWithSearchProps<T, V>, 'nullableValue' | 'useSelectorStore' | 'onChange' | 'name' | 'name_string' | 'name_obj' | 'value' | 'valueTitle' | 'valueObj' | 'filters' | 'readOnly' | 'disabled' | 'just_value' | 'noResultOption'>

export function useSelectWithSearch<T extends BaseModel, V>({
    useSelectorStore,
    onChange,
    name,
    name_string,
    name_obj,
    value,
    valueTitle = '',
    valueObj = null,
    filters = {},
    readOnly,
    disabled,
    nullableValue = false,
    just_value = false,
    noResultOption = { name: 'Sin resultados', value: null, obj: null }
}: UseSelectWithSearchProps<T, V>) {
    // Refs
    const selectRef = useRef<HTMLDivElement>(null)
    const id = useId()
    const setFilter = useSelectorStore((state) => state.setFilter)

    useFilters(useSelectorStore, filters)

    // State
    const isLoading = useSelectorStore((state) => state.isLoading)
    const [showOptions, setShowOptions] = useState(false)
    const [toUseOptions, setToUseOptions] = useState<Array<Option<T>>>([])
    const [options, setOptions] = useState<Array<Option<T>>>([])
    const [selectedValue, setSelectedValue] = useState<Option<T> | null>(null)

    // Close on click outside
    const reset = () => {
        setShowOptions(false)
        setFilter('')
    }
    useClickOutside([selectRef], reset)

    useEffect(() => {
        if (!nullableValue && (value === null || value === undefined)) setSelectedValue(null)
        const option = options.find((opt) => opt.value === value)
        if (option) setSelectedValue(option)
    }, [options])

    useEffect(() => {
        if (!nullableValue && (value === null || value === undefined)) setSelectedValue(null)
        const option = options.find((opt) => opt.value === value)
        if (option) setSelectedValue(option)
        else setSelectedValue({ name: valueTitle, value, obj: valueObj as T | null })
    }, [value, valueTitle, valueObj])

    // Show "No results found" if no results
    useEffect(() => {
        if (!isLoading) {
            if (!options?.length || (options.length === 1 && !options[0].value)) setToUseOptions([noResultOption])
            else setToUseOptions(options)
        }
    }, [options, isLoading])

    // Handle click on button
    const handleClick = () => {
        if (!readOnly && !disabled) setShowOptions(!showOptions)
    }

    // Handle click on option
    const handleChange: HandleChangeType<T> = (value, value_string, obj) => {
        const target = just_value ? { name, value, obj } : { name, value, name_string, value_string, obj, name_obj }
        onChange({ target })
        setSelectedValue(options.find((opt) => opt.value === value) ?? null)
        reset()
    }

    return {
        id,
        selectRef,
        showOptions,
        toUseOptions,
        setOptions,
        selectedValue,
        handleClick,
        handleChange,
        reset,
        useSelectorStore
    }
}

function useFilters<T extends BaseModel>(useSelectorStore: CrudStore.Types.List<T>, filters: Partial<T>) {
    const setFilters = useSelectorStore((state) => state.setFilters)
    const storeFilters = useSelectorStore((state) => state.filters)

    useEffect(() => {
        if (JSON.stringify(storeFilters) !== JSON.stringify(filters)) setFilters(filters)
    }, [filters, storeFilters])
}

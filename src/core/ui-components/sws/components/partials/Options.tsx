import { useEffect } from 'react'

import { Any, BaseModel } from '@/core/types'
import { ListHookType, useListOnScrollRef } from '@/core/ui-datahooks'
import { CrudStore } from '@/core/ui-store'
import type { HandleChangeType, Option } from '../../types'

export interface SelectWithSearchOptionsListProps<T extends BaseModel, V> {
    className?: string
    style?: React.CSSProperties
    nullable?: boolean
    noSelectedOption?: string
    showOptions: boolean
    options: Array<Option<T>>
    nameField?: keyof T
    valueField?: keyof T
    setOptions: (options: Array<Option<T>>) => void
    handleChange: HandleChangeType<T>
    useInfinity: (limit?: number | '*') => ListHookType<T>
    children?: React.ReactNode
    ItemNode?: React.FC<{ name: string, value: V }>
    extraOptions?: Array<Option<T>>
}

export function SelectWithSearchOptionsList<T extends BaseModel, V>({
    className = '',
    style = {},
    noSelectedOption = 'Selecciona una opción',
    nullable = true,
    showOptions,
    options,
    nameField = 'name' as keyof T,
    valueField = 'id' as keyof T,
    setOptions,
    handleChange,
    useInfinity,
    children,
    ItemNode
}: SelectWithSearchOptionsListProps<T, V>) {
    const { dropdownRef, data } = useListOnScrollRef<T>({ useListHook: useInfinity })

    useEffect(() => {
        setOptions([
            ...(nullable ? [{ name: noSelectedOption, value: null, obj: null }] : []),
            ...(data ? data.map((d) => ({
                name: (d as Record<keyof T, Any>)[nameField] as string,
                value: (d as Record<keyof T, Any>)[valueField] as number,
                obj: d
            })) : [])
        ])
    }, [data])

    const optionsClass = `select__options ${showOptions ? 'select__options--open' : ''} ${className}`.trim()

    return (
        <ul
            style={style}
            className={optionsClass}
            ref={dropdownRef}
        >
            {children}
            {options.map((option, i) => (
                <SelectWithSearchOption<T, V>
                    key={i}
                    option={option}
                    handleChange={handleChange}
                    ItemNode={ItemNode}
                />
            ))}
        </ul>
    )
}

export interface SelectWithSearchFixedOptionsListProps<T extends BaseModel, V> {
    className?: string
    style?: React.CSSProperties
    noSelectedOption?: string
    showOptions: boolean
    options: Array<Option<T>>
    setOptions: (options: Array<Option<T>>) => void
    handleChange: HandleChangeType<T>
    children?: React.ReactNode
    defOptions: Array<Option<T>>
    nullable?: boolean
    useSelectorStore: CrudStore.Types.List<T>
    ItemNode?: React.FC<{ name: string, value: V }>
}

export function SelectWithSearchFixedOptionsList<T extends BaseModel, V>({
    className = '',
    style = {},
    noSelectedOption = 'Selecciona una opción',
    showOptions,
    options,
    setOptions,
    handleChange,
    children,
    defOptions,
    nullable = false,
    useSelectorStore,
    ItemNode
}: SelectWithSearchFixedOptionsListProps<T, V>) {
    const filter = useSelectorStore((state) => state.filter)

    useEffect(() => {
        const filteredOptions = defOptions.filter(({ name }) => name.toLowerCase().includes(filter.toLowerCase()))
        const base = nullable ? [{ name: noSelectedOption, value: null, obj: null }] : []
        setOptions([...base, ...filteredOptions])
    }, [defOptions, filter])

    const optionsClass = `select__options ${showOptions ? 'select__options--open' : ''} ${className}`.trim()

    return (
        <ul style={style} className={optionsClass}>
            {children}
            {options.map((option, i) => (
                <SelectWithSearchOption<T, V>
                    key={i}
                    option={option}
                    handleChange={handleChange}
                    ItemNode={ItemNode}
                />
            ))}
        </ul>
    )
}

interface SelectWithSearchOptionProps<T extends BaseModel, V> {
    option: Option<T>
    handleChange: HandleChangeType<T>
    ItemNode?: React.FC<{ name: string, value: V, obj?: T | null }>
}

export function SelectWithSearchOption<T extends BaseModel, V>({
    option: { name, value, obj, onClick },
    handleChange,
    ItemNode
}: SelectWithSearchOptionProps<T, V>) {
    const handleClick = (e: React.MouseEvent) => {
        onClick?.(e)
        handleChange(value, name, obj)
    }

    const isNoResult = name === 'Sin resultados' && value === null
    const optionClass = `select__option ${isNoResult ? 'select__option--no-results' : ''}`.trim()

    return (
        <li onClick={handleClick} className={optionClass}>
            {ItemNode
                ? <ItemNode name={name} value={value as V} obj={obj} />
                : <span className="select__option__text">{name}</span>
            }
        </li>
    )
}

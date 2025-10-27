import { BaseModel } from '@/core/types'
import { CrudStore } from '@/core/ui-store'
import { useEffect, useRef } from 'react'

interface SelectWithSearchInputProps<T extends BaseModel> {
    autoFocus: boolean | undefined
    showOptions: boolean
    useSelectorStore: CrudStore.Types.List<T>
}

export function SelectWithSearchInput<T extends BaseModel>({
    autoFocus,
    showOptions,
    useSelectorStore
}: SelectWithSearchInputProps<T>) {
    const inputRef = useRef<HTMLInputElement>(null)

    const filter = useSelectorStore((state) => state.filter)
    const setFilter = useSelectorStore((state) => state.setFilter)

    useEffect(() => {
        if (showOptions && [undefined, true].includes(autoFocus)) {
            inputRef.current?.focus()
        }
    }, [showOptions, autoFocus])

    return (
        <li className="select__filter">
            <input
                autoComplete="off"
                ref={inputRef}
                type="text"
                placeholder="Buscar..."
                value={filter}
                onChange={({ target: { value } }) => { setFilter(value) }}
            />
        </li>
    )
}

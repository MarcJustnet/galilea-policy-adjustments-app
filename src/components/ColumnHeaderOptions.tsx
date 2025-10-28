import { KeyOfType, OnChangeEvent } from "@/core/types"
import Input from "@/core/ui-components/Input"
import { useClickOutside } from "@/core/ui-hooks"
import { CrudStore } from "@/core/ui-store"
import { Icons } from "@justnetsystems/ui-icons"
import { useEffect, useMemo, useRef, useState } from "react"

interface ColumnHeaderOptionsProps<T> {
    field: KeyOfType<T>
    useTableStore: CrudStore.Types.Table<T>
}

export const ColumnHeaderOptions = <T,>({ field, useTableStore }: ColumnHeaderOptionsProps<T>) => {
    const [isOpen, setIsOpen] = useState(false)
    const [filterValue, setFilterValue] = useState('')
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })

    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [currentField, currentDirection] = useTableStore(state => state.order[0])
    const filters = useTableStore(state => state.filters)
    const onChangeOrder = useTableStore(state => state.onChangeOrder)
    const onChangeOneFilter = useTableStore(state => state.onChangeOneFilter)

    const isCurrentField = useMemo(() => currentField === field, [currentField, field])
    const isAsc = useMemo(() => isCurrentField && currentDirection === 'ASC', [isCurrentField, currentDirection])
    const isDesc = useMemo(() => isCurrentField && currentDirection === 'DESC', [isCurrentField, currentDirection])
    const hasFilter = useMemo(() => Boolean(filters[field as keyof T]), [filters, field])
    const hasSort = useMemo(() => isCurrentField && currentField !== 'id', [isCurrentField, currentField])
    const isActive = useMemo(() => hasFilter || hasSort, [hasFilter, hasSort])

    useClickOutside([menuRef], () => setIsOpen(false), [isOpen])

    const handleFilterChange = (e: OnChangeEvent) => {
        setFilterValue(e.target.value as string)
    }

    const handleFilterApply = () => {
        onChangeOneFilter({ target: { name: field, value: filterValue } } as OnChangeEvent)
        setIsOpen(false)
    }

    const handleClearFilter = () => {
        setFilterValue('')
        onChangeOneFilter({ target: { name: field, value: '' } } as OnChangeEvent)
        setIsOpen(false)
    }

    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setDropdownPosition({
                top: rect.bottom + 4,
                left: rect.left
            })
        }
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleFilterApply()
        if (e.key === 'Escape') setIsOpen(false)
    }

    return (
        <div className="table__actions-menu" style={{ marginLeft: 'auto' }} ref={menuRef}>
            <button
                ref={buttonRef}
                className={`button button--icon button--small ${isActive ? 'button--primary' : ''}`}
                onClick={handleToggle}
                style={{ padding: '0.25rem' }}
            >
                <Icons.EllipsisVertical />
            </button>
            {isOpen && (
                <div
                    className="table__actions-dropdown table__actions-dropdown--fixed"
                    style={{
                        position: 'fixed',
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        zIndex: 20
                    }}
                >
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                        <Input
                            ref={inputRef}
                            type="text"
                            label=''
                            placeholder={`Filtrar...`}
                            value={filterValue}
                            addonPosition='internal'
                            onKeyDown={handleKeyDown}
                            onChange={handleFilterChange}
                            onClick={(e) => e.stopPropagation()}
                            addons={[
                                {
                                    content: <button onClick={handleClearFilter} tabIndex={-1}>{filterValue && <Icons.Xmark />}</button>,
                                    position: 'right'
                                }
                            ]}
                        />
                    </div>
                    <button
                        className="table__actions-item"
                        onClick={onChangeOrder(field, 'ASC')}
                        style={{ opacity: isAsc ? 0.5 : 1, cursor: isAsc ? 'default' : 'pointer' }}
                    >
                        {isAsc && <Icons.Check />}
                        <Icons.ArrowUp /> Ordenar Ascendente
                    </button>
                    <button
                        className="table__actions-item"
                        onClick={onChangeOrder(field, 'DESC')}
                        style={{ opacity: isDesc ? 0.5 : 1, cursor: isDesc ? 'default' : 'pointer' }}
                    >
                        {isDesc && <Icons.Check />}
                        <Icons.ArrowDown /> Ordenar Descendente
                    </button>
                </div>
            )}
        </div>
    )
}
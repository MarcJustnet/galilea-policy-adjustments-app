import { ColumnHeaderOptions } from "@/components/ColumnHeaderOptions"
import Loader from "@/components/layouts/Loader"
import RowActionsMenu from "@/components/RowActionsMenu"
import TablePagination from "@/components/TablePagination"
import Input from "@/core/ui-components/Input"
import Message from "@/core/ui-components/Message"
import { Icons } from "@justnetsystems/ui-icons"
import { useRef } from "react"
import { useNavigate } from "react-router"
import { UsersHooks } from "../../../hooks"
import { UsersService } from "../../../service"
import { UsersStore } from "../../../store"

const Table: React.FC = () => {
    UsersHooks.useTable()

    return (
        <div className="table table--users">
            <TableControls />
            <div className="table__scroll-container">
                <TableHeader />
                <TableBody />
            </div>
            <TableFooter />
        </div>
    )
}

const TableControls: React.FC = () => {
    const navigate = useNavigate()
    const filter = UsersStore.Table(state => state.filter)
    const onChangeFilter = UsersStore.Table(state => state.onChangeFilter)
    const clearFilters = UsersStore.Table(state => state.clearFilters)
    const filters = UsersStore.Table(state => state.filters)

    const hasActiveFilters = filter !== '' || Object.keys(filters).length > 0

    return (
        <div className="table__controls">
            <div className="table__controls__left">
                <Input
                    type="text"
                    placeholder="Filtro general..."
                    value={filter}
                    onChange={onChangeFilter}
                    debounce={300}
                />
                {hasActiveFilters && (
                    <button
                        className="button button--secondary"
                        onClick={clearFilters}
                    >
                        <Icons.X /> Limpiar filtros
                    </button>
                )}
            </div>
            <div className="table__controls__right">
                <button
                    className="button button--primary"
                    onClick={() => navigate('0')}
                >
                    <Icons.Plus /> Nuevo registro
                </button>
            </div>
        </div>
    )
}

const TableHeader: React.FC = () => {
    return (
        <div className="table__header">
            <div className="table__row">
                <div className="table__cell o-visible">
                    Nombre
                    <ColumnHeaderOptions field="name" useTableStore={UsersStore.Table} />
                </div>
                <div className="table__cell o-visible">
                    Correo
                    <ColumnHeaderOptions field="email" useTableStore={UsersStore.Table} />
                </div>
                <div className="table__cell table__cell--actions"></div>
            </div>
        </div>
    )
}

const TableBody: React.FC = () => {
    const navigate = useNavigate()
    const isLoading = UsersStore.Table(state => state.isLoading)
    const data = UsersStore.Table(state => state.data)
    const error = UsersStore.Table(state => state.error)
    const refetch = UsersStore.Table(state => state.refetch)

    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const clickCountRef = useRef(0)

    const handleRowClick = (id: number, e: React.MouseEvent) => {
        // Evitar navegación si se hace click en el botón de acciones
        if ((e.target as HTMLElement).closest('.table__cell--actions')) {
            return
        }

        clickCountRef.current += 1

        if (clickCountRef.current === 1) {
            // Primer click: esperar por un posible segundo click
            clickTimeoutRef.current = setTimeout(() => {
                // Si después de 300ms solo hubo un click, no hacer nada
                clickCountRef.current = 0
            }, 300)
        } else if (clickCountRef.current === 2) {
            // Segundo click: es un doble click
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current)
            }
            clickCountRef.current = 0
            navigate(`${id}`)
        }
    }

    const handleDelete = (id: number) => {
        UsersService.Delete(id)
            .then(() => {
                refetch()
            })
            .catch((error) => {
                console.error('Error deleting record:', error)
            })
    }

    if (isLoading) return (
        <div className="table__loading">
            <Loader />
        </div>
    )

    if (error) return (
        <div className="table__error">
            <Message type="danger" message={error.message} />
        </div>
    )

    if (!data || data.length === 0) return (
        <div className="table__empty">
            <Message type="info" message="No se encontraron usuarios" />
        </div>
    )

    return (
        <div className="table__body">
            {data.map(item => (
                <div
                    key={item.id}
                    className="table__row"
                    onClick={(e) => handleRowClick(item.id, e)}
                >
                    <div className="table__cell">{item.name}</div>
                    <div className="table__cell">{item.email}</div>
                    <div className="table__cell table__cell--actions">
                        <RowActionsMenu>
                            <button className="table__actions-item x-onclick" onClick={() => navigate(`${item.id}`)}>
                                <Icons.PenLine /> Editar
                            </button>
                            <button className="table__actions-item table__actions-item--danger x-onclick" onClick={() => handleDelete(item.id)}>
                                <Icons.Trash type="regular" /> Eliminar
                            </button>
                        </RowActionsMenu>
                    </div>
                </div>
            ))}
        </div>
    )
}

const TableFooter: React.FC = () => {
    return (
        <div className="table__footer">
            <TablePagination useTableStore={UsersStore.Table} recordLabel="registros" />
        </div>
    )
}

export default Table
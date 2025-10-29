import { ColumnHeaderOptions } from "@/components/ColumnHeaderOptions"
import Loader from "@/components/layouts/Loader"
import RowActionsMenu from "@/components/RowActionsMenu"
import TablePagination from "@/components/TablePagination"
import type { Role } from "@/core/types/models"
import Input from "@/core/ui-components/Input"
import Message from "@/core/ui-components/Message"
import Modal from "@/core/ui-components/Modal"
import { Icons } from "@justnetsystems/ui-icons"
import { useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useNavigate } from "react-router"
import { RolesHooks } from "../../../hooks"
import { RolesService } from "../../../service"
import { RolesStore } from "../../../store"

const Table: React.FC = () => {
    RolesHooks.useTable()

    return (
        <div className="table table--roles">
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
    const filter = RolesStore.Table(state => state.filter)
    const onChangeFilter = RolesStore.Table(state => state.onChangeFilter)
    const clearFilters = RolesStore.Table(state => state.clearFilters)
    const filters = RolesStore.Table(state => state.filters)

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
                    Código
                    <ColumnHeaderOptions field="code" useTableStore={RolesStore.Table} />
                </div>
                <div className="table__cell o-visible">
                    Nombre
                    <ColumnHeaderOptions field="name" useTableStore={RolesStore.Table} />
                </div>
                <div className="table__cell o-visible">
                    Descripción
                    <ColumnHeaderOptions field="description" useTableStore={RolesStore.Table} />
                </div>
                <div className="table__cell o-visible">
                    Sistema
                    <ColumnHeaderOptions field="isSystemRole" useTableStore={RolesStore.Table} />
                </div>
                <div className="table__cell table__cell--actions"></div>
            </div>
        </div>
    )
}

const TableBody: React.FC = () => {
    const navigate = useNavigate()
    const isLoading = RolesStore.Table(state => state.isLoading)
    const data = RolesStore.Table(state => state.data)
    const error = RolesStore.Table(state => state.error)
    const refetch = RolesStore.Table(state => state.refetch)

    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const clickCountRef = useRef(0)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [itemToDelete, setItemToDelete] = useState<Role | null>(null)

    const handleRowClick = (id: number, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.table__cell--actions')) {
            return
        }

        clickCountRef.current += 1

        if (clickCountRef.current === 1) {
            clickTimeoutRef.current = setTimeout(() => {
                clickCountRef.current = 0
            }, 300)
        } else if (clickCountRef.current === 2) {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current)
            }
            clickCountRef.current = 0
            navigate(`${id}`)
        }
    }

    const handleDeleteClick = (item: Role) => {
        setItemToDelete(item)
        setShowDeleteModal(true)
    }

    const handleConfirmDelete = () => {
        if (itemToDelete?.id) {
            RolesService.Delete(itemToDelete.id)
                .then(() => {
                    refetch()
                })
                .catch((error) => {
                    console.error('Error deleting record:', error)
                })
        }
        setShowDeleteModal(false)
        setItemToDelete(null)
    }

    const handleCancelDelete = () => {
        setShowDeleteModal(false)
        setItemToDelete(null)
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
            <Message type="info" message="No se encontraron roles" />
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
                    <div className="table__cell">{item.code}</div>
                    <div className="table__cell">{item.name}</div>
                    <div className="table__cell">{item.description || '-'}</div>
                    <div className="table__cell">{item.isSystemRole ? 'Sí' : 'No'}</div>
                    <div className="table__cell table__cell--actions">
                        <RowActionsMenu>
                            <button className="table__actions-item x-onclick" onClick={() => navigate(`${item.id}`)}>
                                <Icons.PenLine /> Editar
                            </button>
                            <button className="table__actions-item table__actions-item--danger x-onclick" onClick={() => handleDeleteClick(item)}>
                                <Icons.Trash type="regular" /> Eliminar
                            </button>
                        </RowActionsMenu>
                    </div>
                </div>
            ))}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                item={itemToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    )
}

interface DeleteConfirmationModalProps {
    isOpen: boolean
    item: Role | null
    onConfirm: () => void
    onCancel: () => void
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, item, onConfirm, onCancel }) => {
    if (!isOpen || !item) return null

    return createPortal(
        <Modal isOpen={isOpen} handleClose={onCancel}>
            <div className="modal__header">
                <Icons.Trash style={{ color: '#ef4444', fontSize: '3rem' }} />
                <h2 className="modal__title">Eliminar rol</h2>
                <p className="modal__description">
                    ¿Estás seguro de que quieres eliminar este rol?
                </p>
            </div>

            <div className="modal__body">
                <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
                        {item.name} ({item.code})
                    </p>
                    {item.description && (
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                            {item.description}
                        </p>
                    )}
                    {item.isSystemRole && (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#ef4444', fontWeight: 600 }}>
                            ⚠️ Este es un rol de sistema
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={onConfirm}
                        className="button button--danger button--large"
                        style={{ flex: 1 }}
                    >
                        <Icons.Trash /> Eliminar
                    </button>
                    <button
                        onClick={onCancel}
                        className="button button--secondary button--large"
                        style={{ flex: 1 }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </Modal>,
        document.body
    )
}

const TableFooter: React.FC = () => {
    return (
        <div className="table__footer">
            <TablePagination useTableStore={RolesStore.Table} recordLabel="roles" />
        </div>
    )
}

export default Table

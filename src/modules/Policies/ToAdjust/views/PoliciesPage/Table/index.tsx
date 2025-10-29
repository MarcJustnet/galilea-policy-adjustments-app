import { ColumnHeaderOptions } from "@/components/ColumnHeaderOptions"
import Loader from "@/components/layouts/Loader"
import RowActionsMenu from "@/components/RowActionsMenu"
import TablePagination from "@/components/TablePagination"
import Input from "@/core/ui-components/Input"
import Message from "@/core/ui-components/Message"
import { Icons } from "@justnetsystems/ui-icons"
import { useRef } from "react"
import { useNavigate } from "react-router"
import { PoliciesToAdjustHooks } from "../../../hooks"
import { PoliciesToAdjustStore } from "../../../store"

const Table: React.FC = () => {
    PoliciesToAdjustHooks.useTable()

    return (
        <div className="table table--policies">
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
    const filter = PoliciesToAdjustStore.Table(state => state.filter)
    const onChangeFilter = PoliciesToAdjustStore.Table(state => state.onChangeFilter)
    const clearFilters = PoliciesToAdjustStore.Table(state => state.clearFilters)
    const filters = PoliciesToAdjustStore.Table(state => state.filters)

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
            </div>
        </div>
    )
}

const TableHeader: React.FC = () => {
    return (
        <div className="table__header">
            <div className="table__row">
                <div className="table__cell">
                    Número
                    <ColumnHeaderOptions field="NUMERO" useTableStore={PoliciesToAdjustStore.Table} />
                </div>
                <div className="table__cell">
                    Póliza
                    <ColumnHeaderOptions field="POLIZA_CIA" useTableStore={PoliciesToAdjustStore.Table} />
                </div>
                <div className="table__cell">
                    Cliente
                    <ColumnHeaderOptions field="CLIENT_NAME" useTableStore={PoliciesToAdjustStore.Table} />
                </div>
                <div className="table__cell">
                    NIF
                    <ColumnHeaderOptions field="CLIENT_NIF" useTableStore={PoliciesToAdjustStore.Table} />
                </div>
                <div className="table__cell">
                    Compañía
                    <ColumnHeaderOptions field="COMPANY_NAME" useTableStore={PoliciesToAdjustStore.Table} />
                </div>
                <div className="table__cell">
                    Ramo
                    <ColumnHeaderOptions field="BRANCH_DESCRIPTION" useTableStore={PoliciesToAdjustStore.Table} />
                </div>
                <div className="table__cell">
                    Tipo Declaración
                    <ColumnHeaderOptions field="DECLARATION_TYPE_DESCRIPTION" useTableStore={PoliciesToAdjustStore.Table} />
                </div>
                <div className="table__cell">
                    Riesgo
                    <ColumnHeaderOptions field="RIESGO" useTableStore={PoliciesToAdjustStore.Table} />
                </div>
                <div className="table__cell">
                    Aviso Regul.
                    <ColumnHeaderOptions field="AVISO_REGUL" useTableStore={PoliciesToAdjustStore.Table} />
                </div>
                <div className="table__cell">
                    Prima Total
                    <ColumnHeaderOptions field="PRIMA_TOTAL" useTableStore={PoliciesToAdjustStore.Table} />
                </div>
                <div className="table__cell table__cell--actions"></div>
            </div>
        </div>
    )
}

const TableBody: React.FC = () => {
    const navigate = useNavigate()
    const isLoading = PoliciesToAdjustStore.Table(state => state.isLoading)
    const data = PoliciesToAdjustStore.Table(state => state.data)
    const error = PoliciesToAdjustStore.Table(state => state.error)

    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const clickCountRef = useRef(0)

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
            <Message type="info" message="No se encontraron pólizas" />
        </div>
    )

    return (
        <div className="table__body">
            {data.map((item) => {
                const formatDate = (date: Date | string | null) => {
                    if (!date) return '-'
                    const d = new Date(date)
                    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
                }

                return (
                    <div
                        key={item.NUMERO}
                        className="table__row"
                        onClick={(e) => handleRowClick(item.NUMERO, e)}
                    >
                        <div className="table__cell">{item.NUMERO}</div>
                        <div className="table__cell">{item.POLIZA_CIA?.trim() || '-'}</div>
                        <div className="table__cell">{item.CLIENT_NAME?.trim() || '-'}</div>
                        <div className="table__cell">{item.CLIENT_NIF || '-'}</div>
                        <div className="table__cell">{item.COMPANY_NAME?.trim() || '-'}</div>
                        <div className="table__cell">{item.BRANCH_DESCRIPTION?.trim() || '-'}</div>
                        <div className="table__cell">{item.DECLARATION_TYPE_DESCRIPTION?.trim() || '-'}</div>
                        <div className="table__cell">{item.RIESGO?.trim() || '-'}</div>
                        <div className="table__cell">{formatDate(item.AVISO_REGUL)}</div>
                        <div className="table__cell">{item.PRIMA_TOTAL?.toFixed(2) || '0.00'} €</div>
                        <div className="table__cell table__cell--actions">
                            <RowActionsMenu>
                                <button className="table__actions-item x-onclick" onClick={() => navigate(`${item.NUMERO}`)}>
                                    <Icons.PenLine /> Editar
                                </button>
                            </RowActionsMenu>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

const TableFooter: React.FC = () => {
    return (
        <div className="table__footer">
            <TablePagination useTableStore={PoliciesToAdjustStore.Table} />
        </div>
    )
}

export default Table

import { ColumnHeaderOptions } from "@/components/ColumnHeaderOptions"
import Loader from "@/components/layouts/Loader"
import RowActionsMenu from "@/components/RowActionsMenu"
import TablePagination from "@/components/TablePagination"
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

    return (
        <div className="table__controls">
            <input
                type="text"
                className="form__input"
                placeholder="Filtro general..."
                value={filter}
                onChange={onChangeFilter}
            />
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
                    <ColumnHeaderOptions field="CLIENTE" useTableStore={PoliciesToAdjustStore.Table} />
                </div>
                <div className="table__cell">
                    Riesgo
                    <ColumnHeaderOptions field="RIESGO" useTableStore={PoliciesToAdjustStore.Table} />
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
            {data.map((item) => (
                <div
                    key={item.id}
                    className="table__row"
                    onClick={(e) => handleRowClick(item.id, e)}
                >
                    <div className="table__cell">{item.NUMERO}</div>
                    <div className="table__cell">{item.POLIZA_CIA.trim()}</div>
                    <div className="table__cell">{item.CLIENTE}</div>
                    <div className="table__cell">{item.RIESGO?.trim() || '-'}</div>
                    <div className="table__cell">{item.PRIMA_TOTAL.toFixed(2)} €</div>
                    <div className="table__cell table__cell--actions">
                        <RowActionsMenu>
                            <button className="table__actions-item x-onclick" onClick={() => navigate(`${item.NUMERO}`)}>
                                <Icons.PenLine /> Editar
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
            <TablePagination useTableStore={PoliciesToAdjustStore.Table} />
        </div>
    )
}

export default Table

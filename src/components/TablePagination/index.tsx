import { BaseModel } from "@/core/types"
import { CrudStore } from "@/core/ui-store"
import { Fragment } from "react"

interface TablePaginationProps<T extends BaseModel> {
    recordLabel?: string
    useTableStore: CrudStore.Types.Table<T>
}

const TablePagination = <T extends BaseModel>({ useTableStore, recordLabel = 'registros' }: TablePaginationProps<T>) => {
    const page = useTableStore(state => state.page)
    const limit = useTableStore(state => state.limit)
    const totalRecords = useTableStore(state => state.totalRecords)
    const totalPages = useTableStore(state => state.totalPages)
    const setPage = useTableStore(state => state.setPage)

    const from = totalRecords === 0 ? 0 : ((page - 1) * (limit === '*' ? totalRecords : limit)) + 1
    const to = Math.min(page * (limit === '*' ? totalRecords : limit), totalRecords)
    const hasPrev = page > 1
    const hasNext = page < totalPages

    const handlePrev = () => {
        if (hasPrev) setPage(page - 1)
    }

    const handleNext = () => {
        if (hasNext) setPage(page + 1)
    }

    return (
        <Fragment>
            <span className="table__pagination-info">
                Mostrando {from}-{to} de {totalRecords} {recordLabel}
            </span>
            <div className="table__pagination-controls">
                <button
                    className="button button--secondary button--small"
                    onClick={handlePrev}
                    disabled={!hasPrev}
                >
                    &lt; Anterior
                </button>
                <button
                    className="button button--secondary button--small"
                    onClick={handleNext}
                    disabled={!hasNext}
                >
                    Siguiente &gt;
                </button>
            </div>
        </Fragment>
    )
}

export default TablePagination

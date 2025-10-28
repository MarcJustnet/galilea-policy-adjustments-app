export interface Branch {
    CODIGO: string
    AREA: string
    SUBRAMO: string
    DESCRIPCION: string | null
    VALIDACION: number
    RAMO_DGS: number | null
    LOPD: number
    GASTOS: number
    COTIZADOR_FORMULARIO: number
    COTIZADOR_DESCRIPCION: string | null
    COTIZADOR_HTML_FORM: Buffer | null
    COTIZADOR_HTML_EDIT: Buffer | null
    COTIZADOR_PRESENTACION: Buffer | null
    COTIZADOR_CONSIDERACIONES: Buffer | null
    COTIZADOR_CLAUSULAS: Buffer | null
    COTIZADOR_ECONOMICAS: Buffer | null
    RAMO_EIAC: string | null
    MARGEN_DESEADO: number
}

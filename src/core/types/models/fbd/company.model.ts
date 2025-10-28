export interface Company {
    CODIGO: string
    NOMBRE: string | null
    NIF: string
    DIRECCION: string | null
    POBLACION: string | null
    POSTAL: number | null
    PROVINCIA: string | null
    PAIS: number | null
    OFI: number | null
    CUENTA: string
    AGENTE: string
    OBSERVACIONES: Buffer | null
    WEB: string | null
    USUARIO: string | null
    CLAVE: string | null
    WEB_NOTAS: Buffer | null
    ALTA: Date | null
    BAJA: Date | null
    BANCO: string
    OFICINA: string
    DC: string
    CTA: string
    TOTAL: number
    BANCO_PAGO: number | null
    EMAIL: string | null
    EMAIL_PRODUC: string | null
    TOTAL_CD: number
    BANCO_CD: number | null
    DESVIO_COMIS: number
    PRECARTERA_SCHEMA: Buffer | null
    CD_ACTUALIZACION_SCHEMA: Buffer | null
    CD_COBROCOMISION_SCHEMA: Buffer | null
    CONCILIAR_PENDCOBRO_SCHEMA: Buffer | null
    CONCILIAR_LIQUI_SCHEMA: Buffer | null
    AUTORIZA_NODEVOLREC: number
    BANCO2: string
    OFICINA2: string
    DC2: string
    CTA2: string
    MARGEN_LIQUI: number | null
    ESPECIALISTA: number | null
    CODIGO_DGS: string | null
    CD_IMPAGADOS_SCHEMA: Buffer | null
    LIQUIDAR_WEB: number
    AGENTE_EIAC: string | null
    LIQUIDAR_WEB2: number
}

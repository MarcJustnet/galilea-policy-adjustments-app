export interface Policy {
    NUMERO: number
    CLIENTE: number
    POLIZA_CIA: string
    MATRICULA: string | null
    CIA: string
    RAMO: string
    SUBAGENTE: number
    COORDINADOR: number
    OFICINA: number
    FECHA_EFECTO: Date | null
    FECHA_VMT_POL: Date | null
    FECHA_VMT_REC: Date | null
    TIPO_VMT_REC: string
    PRIMA_NETA: number
    CONSORCIO: number
    IMPUESTOS: number
    FONDO_MUTUAL: number
    PRIMA_TOTAL: number
    COMISION: number
    FRANQUICIA: number
    PACTADA_COMIS: number
    PACTADA_MOTIVO: Buffer | null
    PACTADA_COMISION: number
    CONDICIONADO: string | null
    REEMPLAZA_A: number | null
    REEMPLAZA_POR: number | null
    CIA_REAL: string | null
    FORMA_PAGO: number
    FORMA_AVISO: number
    CCC: number | null
    DIRECCION: number | null
    CANAL: number | null
    DECENALES: number
    FLOTAS: number
    COLECTIVOS: number
    DECLARACION: number | null
    ESPECIFICACION: string
    AVISO_FLOTANTE: Date | null
    AVISO_REGUL: Date | null
    OBSERVACIONES: Buffer | null
    HISTORIAL: Buffer | null
    TIPO: string
    ESTADO: number
    FECHA_ESTADO: Date | null
    BAJA: number | null
    NUMERO_BAJA: number | null
    FECHA_BAJA: Date | null
    USUARIO: string | null
    LAST: Date | null
    ASESORA_MOTIVADO: number | null
    RIESGO: string | null
    CANAL_SINIESTRO: number
    ESPECIALISTA: number
    GASTOS_IMP: number
    GASTOS_IVA: number
    GASTOS_BASE: number
    GASTOS_FP: number | null
    GASTOS_UNRECIBO: number
    RESPONSABLE: number
    FINANCIERAS: number
    FINAN_IMPORTE: number
    FINAN_COMISION: number
    EJECUTIVO: number | null
    PACTADA_CESION: number
    DEVENGO_COLABORADOR: Date | null
    AUTORIZAR_FORMAPAGO: number
    // Joined fields from related tables
    CLIENT_NAME?: string | null
    CLIENT_NIF?: string
    CLIENT_EMAIL?: string | null
    DECLARATION_TYPE_DESCRIPTION?: string | null
    COMPANY_NAME?: string | null
    BRANCH_DESCRIPTION?: string | null
}

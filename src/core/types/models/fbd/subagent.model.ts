export interface Subagent {
    CODIGO: number
    NOMBRE: string | null
    NIF: string
    DIRECCION: string | null
    POBLACION: string | null
    POSTAL: number | null
    PROVINCIA: string | null
    PAIS: number | null
    FIRMA: string | null
    NIF_REPRES: string | null
    TELEFONO: string | null
    FAX: string | null
    MOVIL: string | null
    EMAIL: string | null
    CUENTA: string
    CUENTA_GASTOS: string
    CUENTA_HONORARIOS: string
    OFI: number | null
    IRPF: number
    OBSERVACIONES: Buffer | null
    WEB: string | null
    ALTA: Date | null
    BAJA: Date | null
    COMISION_1ANY: number
    COMISION_RESTO: number
    COMISION_TIPO: number | null
    BANCO: string
    OFICINA: string
    DC: string
    CTA: string
    TOTAL: number
    BANCO_PAGO: number | null
    IRPF_IMP: number
    NETO: number
    VARIOS: number
    FINAL: number
    USUARIO: number | null
    EXCLUIR_LIQ: number
    AUXILIAR_EXTERNO: number
    CONTRATO_FIRMADO: number
    COBRO_AUXILIAR: number
    COMISION_GASTOS: number
    COORDINADOR: number
    TIPO_LIQ: string | null
    REVISION: string | null
    RESPONSABLE: number | null
    TIPO1: number | null
    TIPO2: number | null
    ACTIVIDAD: number | null
    CANDIDATO: number
    GRUPO: number
    COMISION_BONIF: number
    EXCLUIR_NOBONIF: number | null
    CONTACTO: string | null
    DIRECCION_ENVIO: Buffer | null
    CONTRATO_NUEVO: number
    EXCLUIR_SMTP: number
    INFORMADOR: number
    REMUNERACION: number | null
    FORMACION: number | null
    USUARIO_AD: string | null
}

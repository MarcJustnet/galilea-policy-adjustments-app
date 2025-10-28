export interface Client {
    CODIGO: number
    NOMBRE: string | null
    NIF: string
    ATENCION: string | null
    DIRECCION: string | null
    DIRECCION2: string | null
    POBLACION: string | null
    POSTAL: number | null
    PROVINCIA: string | null
    PAIS: number | null
    CUENTA: string
    OBSERVACIONES: Buffer | null
    WEB: string | null
    NACIDO: Date | null
    ALTA: Date | null
    BAJA: Date | null
    BAJA_MOTIVO: number | null
    ESTADO: number
    USUARIO: string | null
    LAST: Date | null
    ANTICIPOS: number
    SUBAGENTE: number
    COORDINADOR: number
    OFICINA: number
    TIPO: number
    GRUPO: number
    GRUPO_EMPRESA: number
    ACTIVIDAD: number
    IDIOMA: number
    TRATO: number
    FORMA_PAGO: number
    FORMA_AVISO: number
    CONTACTO: number
    CONTACTO_TEXTO: string | null
    VINCULO: string | null
    REVISAR: number
    REVISION_ULTIMA: Date | null
    REVISION_MES: number | null
    REVISION_MOTIVO: string | null
    INFO_PREVIA: number | null
    IMPORTE_CC: number
    CAMPANA: number
    ENVIAR_RECCIA: number
    MESES_CC: string | null
    DIAPAGO_CC: number | null
    EJECUTIVO: number | null
    EMAIL: string | null
    TELEFONO: string | null
    MOVIL: string | null
}

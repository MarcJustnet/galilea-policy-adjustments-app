export interface ClientBankAccount {
    CLIENTE: number
    NUMERO: number
    DESCRIPCION: string | null
    BANCO: string
    OFICINA: string
    DC: string
    CTA: string
    DIA_PAGO: number | null
    DEFECTO: number
    MANDATO_SEPA: Date | null
    MANDATO_OK: Date | null
    IBAN2: string | null
    BIC2: string | null
}

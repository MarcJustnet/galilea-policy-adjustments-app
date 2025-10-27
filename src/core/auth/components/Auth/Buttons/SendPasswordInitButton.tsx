import { toast } from '@justnetsystems/ui-toast'
import { useState } from 'react'
import { type InviteButtonProps } from './types'

const SendPasswordInitButton: React.FC<InviteButtonProps> = ({ short = false, data, Service }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setIsLoading(true)
        return Service.Invite(data.id)
            .then(() => {
                setSent(true)
                toast('Enlace enviado correctamente', { type: 'success' })
                return void 0
            })
            .catch(() => { toast('Error al enviar el enlace', { type: 'error' }) })
            .finally(() => { setIsLoading(false) })
    }
    if (!data.id || data.lastInvitationIsUsed) return null
    return (
        <button disabled={isLoading || sent} className={`button is-link ${isLoading ? 'is-loading' : ''} ${short ? 'is-small' : ''}`} onClick={onClick}>
            {sent ? 'Enlace enviado' : 'Enviar enlace de invitación'}
        </button>
    )
}

export default SendPasswordInitButton

import Input from '@/core/ui-components/Input'
import Modal from '@/core/ui-components/Modal'
import { toast } from '@justnetsystems/ui-toast'
import { Fragment, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePasswordUpdate } from '../../../hooks/usePasswordUpdate'
import { type InviteButtonProps } from './types'

const UpdatePasswordButton: React.FC<InviteButtonProps> = ({ short = false, data, Service }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => { setIsOpen(true) }
    const handleClose = () => { setIsOpen(false) }

    if (!data.id) return null
    return (
        <Fragment>
            <button disabled={isOpen} className={`button is-link ${short ? 'is-small' : ''}`} onClick={handleOpen}>
                Actualizar contraseña
            </button>
            <UpdatePasswordModal id={data.id} isOpen={isOpen} handleClose={handleClose} Service={Service} />
        </Fragment>
    )
}

export default UpdatePasswordButton

interface UpdatePasswordModalProps {
    id: InviteButtonProps['data']['id']
    isOpen: boolean
    handleClose: () => void
    Service: InviteButtonProps['Service']
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ id, isOpen, handleClose, Service }) => {
    const { data: body, isLoading, setIsLoading, err, isDisabled, isValid, onChange } = usePasswordUpdate()

    const handleSubmit = () => {
        setIsLoading(true)
        return Service.PasswordUpdate(id, body)
            .then(() => {
                toast('Contraseña actualizada correctamente', { type: 'success' })
                handleClose()
                return void 0
            })
            .catch(() => { toast('Error al actualizar la contraseña', { type: 'error' }) })
            .finally(() => { setIsLoading(false) })
    }

    if (!isOpen) return null

    return createPortal(
        <Modal isOpen={isOpen} handleClose={handleClose}>
            <div className='modal__header modal__header--password-update'>
                <h1 className='modal__title'>Actualizar contraseña</h1>
            </div>

            <div className='modal__body'>
                <Input
                    label='Contraseña'
                    error={err('password')}
                    type='password'
                    name='password'
                    placeholder='********'
                    onChange={onChange}
                />
                <Input
                    label='Confirmar contraseña'
                    error={err('confirmPassword')}
                    type='password'
                    name='confirmPassword'
                    placeholder='********'
                    onChange={onChange}
                />
            </div>
            <div className='modal__footer'>
                <button disabled={isDisabled || !isValid} className={`button button--primary ${isLoading ? 'button--loading' : ''}`} onClick={handleSubmit}>
                    Actualizar
                </button>
                <button disabled={isLoading} className='button button--secondary' onClick={handleClose}>
                    Cerrar
                </button>
            </div>
        </Modal>,
        document.body
    )
}

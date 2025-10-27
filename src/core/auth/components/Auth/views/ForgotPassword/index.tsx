import { OnChangeEvent } from '@/core/types'
import Input from '@/core/ui-components/Input'
import { Icons } from '@justnetsystems/ui-icons'
import { toast } from '@justnetsystems/ui-toast'
import { useState } from 'react'
import { Link } from 'react-router'
import { useAuthContext } from '../../../../context'

const ForgotPasswordPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [done, setSent] = useState(false)

    const { Service } = useAuthContext()

    const onChange = <T,>(e: OnChangeEvent<T>) => { setEmail(e.target.value as string) }

    const isDisabled = !email || isLoading

    const onSave = () => {
        setIsLoading(true)
        return Service.ForgotPassword({ email })
            .then(() => {
                toast('Email para restaurar contraseña enviado', { type: 'success' })
                setSent(true)
                return true
            })
            .catch((err: Error) => {
                toast(err.message ?? err.message, { type: 'error' })
            })
            .finally(() => { setIsLoading(false) })
    }

    const handleKeyDown = async ({ key }: { key: string }) => {
        if (key === 'Enter') onSave()
    }

    return (
        <div className='auth-page'>
            <div className='auth-card'>
                <div className='auth-card__header'>
                    <h1>Restaurar contraseña</h1>
                    <p>Ingresa tu correo electrónico para recibir instrucciones</p>
                </div>

                {!done && (
                    <div className='auth-card__form'>
                        <div>
                            <Input label='Correo electrónico' value={email} onChange={onChange} placeholder='email@ejemplo.com' onKeyDown={handleKeyDown} />
                        </div>
                        <div>
                            <button disabled={isDisabled} className={`auth-form-button is-success ${isLoading ? 'is-loading' : ''}`} onClick={onSave}>Restaurar contraseña</button>
                        </div>
                    </div>
                )}

                {done && (
                    <div className='auth-card__done'>
                        <h2>Email para restaurar contraseña enviado</h2>
                        <p>Revisa tu correo para continuar con el proceso</p>
                    </div>
                )}

                <div className='auth-card__back'>
                    <Link to='../login'>
                        <Icons.ArrowLeft />
                        Ir al inicio
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordPage

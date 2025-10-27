import Loader from '@/components/layouts/Loader'
import { User } from '@/core/types/models'
import Input from '@/core/ui-components/Input'
import Message from '@/core/ui-components/Message'
import { Icons } from '@justnetsystems/ui-icons'
import { toast } from '@justnetsystems/ui-toast'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useAuthContext } from '../../../../context'
import { usePasswordUpdate } from '../../../../hooks/usePasswordUpdate'
import { PasswordInput } from '../../Form/PasswordInput'

const PasswordRestorePage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { token } = useParams()
    const { Service } = useAuthContext()

    const checkToken = (token: string | undefined) => {
        if (!token) {
            setError('Token not found')
        } else {
            setIsLoading(true)
            return Service.PasswordRestoreToken(token)
                .then((res) => {
                    setUser(res.data.data.data)
                })
                .catch((err: Error) => {
                    let error = err.message
                    if (error === 'Invalid data') error = 'Token inválido'
                    console.log(error)
                    setError(error)
                })
                .finally(() => { setIsLoading(false) })
        }
    }

    useEffect(() => { checkToken(token) }, [token])

    return (
        <div className={`auth-page ${isLoading ? 'loading' : ''}`}>
            {isLoading && <Loader />}
            {!isLoading && <PasswordRestoreContent user={user} token={token!} error={error} />}
        </div>
    )
}

interface PasswordRestoreContentProps {
    user: User | null
    token: string
    error: string | null
}

const PasswordRestoreContent: React.FC<PasswordRestoreContentProps> = ({ user, token, error }) => {
    const { data, isLoading, setIsLoading, err, isDisabled, isValid, onChange, done, setDone } = usePasswordUpdate()
    const { Service, login } = useAuthContext()
    const navigate = useNavigate()

    const onSave = () => {
        setIsLoading(true)
        return Service.PasswordRestore(token, data)
            .then(() => {
                toast('Contraseña actualizada correctamente', { type: 'success' })
                setDone(true)
                return true
            })
            .catch((err: Error) => { toast(err?.message, { type: 'error' }) })
            .finally(() => { setIsLoading(false) })
    }

    const handleLogin = () => {
        if (!user) return
        return login({ email: user.email, password: data.password })
            .then((res) => {
                if (res) toast('Logged in', { type: 'success' })
                navigate('../login')
                return res
            })
            .catch((error: string) => {
                toast(error, { type: 'error' })
            })
    }

    const handleKeyDown = async ({ key }: { key: string }) => {
        if (key === 'Enter') onSave()
    }

    return (
        <div className='auth-card'>
            {error && <Message type='danger' message={error} />}
            {!error && (
                <>
                    <div className='auth-card__header'>
                        <h1>Hola {user?.name}!</h1>
                        <p>Ingresa tu nueva contraseña</p>
                    </div>

                    {!done && (
                        <div className='auth-card__form'>
                            <div>
                                <Input label='Correo electrónico' disabled={true} value={user?.email} />
                            </div>
                            <div>
                                <PasswordInput label='Nueva contraseña' error={err('password')} value={data.password} name='password' onChange={onChange} onKeyDown={handleKeyDown} />
                            </div>
                            <div>
                                <PasswordInput label='Confirmar contraseña' error={err('confirmPassword')} value={data.confirmPassword} name='confirmPassword' onChange={onChange} onKeyDown={handleKeyDown} />
                            </div>
                            <div>
                                <button disabled={isDisabled || !isValid} className={`auth-form-button is-success ${isLoading ? 'is-loading' : ''}`} onClick={onSave}>Restaurar contraseña</button>
                            </div>
                        </div>
                    )}

                    {done && (
                        <div className='auth-card__done'>
                            <h2>Contraseña actualizada correctamente</h2>
                            <p>Ahora ya puedes <a onClick={handleLogin}>iniciar sesión</a></p>
                        </div>
                    )}
                </>
            )}
            {error && (
                <div className='auth-card__back'>
                    <Link to='../login'>
                        <Icons.ArrowLeft />
                        Ir al inicio
                    </Link>
                </div>
            )}
        </div>
    )
}

export default PasswordRestorePage

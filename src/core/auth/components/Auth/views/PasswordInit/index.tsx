import Loader from '@/components/layouts/Loader'
import { useAuthContext } from '@/core/auth/context'
import { usePasswordUpdate } from '@/core/auth/hooks/usePasswordUpdate'
import { User } from '@/core/types/models'
import Input from '@/core/ui-components/Input'
import Message from '@/core/ui-components/Message'
import { APIError } from '@/core/ui-service'
import { Icons } from '@justnetsystems/ui-icons'
import { toast } from '@justnetsystems/ui-toast'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { PasswordInput } from '../../Form'

const PasswordInitPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string | null>(null)
    const { token } = useParams()
    const { Service } = useAuthContext()

    const checkToken = (token: string | undefined) => {
        if (!token) {
            setError('Token not found')
            return void 0
        } else {
            setIsLoading(true)
            return Service.PasswordInitToken(token)
                .then((res) => {
                    setUser(res.data.data.data)
                    return void 0
                })
                .catch((err: APIError) => {
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
            {!isLoading && <PasswordInitContent user={user} token={token!} error={error} />}
        </div>
    )
}

interface PasswordInitContentProps {
    user: User | null
    token: string
    error: string | null
}

const PasswordInitContent: React.FC<PasswordInitContentProps> = ({ user, token, error }) => {
    const { data, isLoading, setIsLoading, err, isDisabled, isValid, onChange, done, setDone } = usePasswordUpdate()
    const { Service, login } = useAuthContext()
    const navigate = useNavigate()

    const onSave = () => {
        setIsLoading(true)
        return Service.PasswordInit(token, data)
            .then(() => {
                toast('Contraseña creada correctamente', { type: 'success' })
                setDone(true)
                return true
            })
            .catch((err: Error) => { toast(err.message, { type: 'error' }) })
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
            {Boolean(error) && <Message type='danger' message={error as string} />}
            {!error && (
                <>
                    <div className='auth-card__header'>
                        <h1>Bienvenido {user?.name}!</h1>
                        <p>Configura tu contraseña para comenzar</p>
                    </div>

                    {!done && (
                        <div className='auth-card__form'>
                            <div>
                                <Input label='Correo electrónico' disabled={true} value={user?.email} />
                            </div>
                            <div>
                                <PasswordInput label='Contraseña' error={err('password')} value={data.password} name='password' onChange={onChange} onKeyDown={handleKeyDown} />
                            </div>
                            <div>
                                <PasswordInput label='Confirmar contraseña' error={err('confirmPassword')} value={data.confirmPassword} name='confirmPassword' onChange={onChange} onKeyDown={handleKeyDown} />
                            </div>
                            <div>
                                <button disabled={isDisabled || !isValid} className={`auth-form-button is-success ${isLoading ? 'is-loading' : ''}`} onClick={onSave}>Crear contraseña</button>
                            </div>
                        </div>
                    )}

                    {done && (
                        <div className='auth-card__done'>
                            <h2>Contraseña creada correctamente</h2>
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

export default PasswordInitPage

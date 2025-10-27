import { OnChangeEvent } from '@/core/types'
import Input from '@/core/ui-components/Input'
import { toast } from '@justnetsystems/ui-toast'
import { useState } from 'react'
import { useAuthContext } from '../../../context'
import { PasswordInput } from './PasswordInput'

const UserPasswordLoginButton: React.FC = () => {
    const { login } = useAuthContext()

    const [data, setData] = useState<{ email: string, password: string }>({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const onChange = ({ target: { value, name } }: OnChangeEvent) => {
        setData({ ...data, [name]: value })
    }

    const handleLogin = () => {
        setLoading(true)
        return login(data)
            .then((res) => {
                if (res) toast('Logged in', { type: 'success' })
                return res
            })
            .catch((error: string) => {
                toast(error, { type: 'error' })
            })
            .finally(() => { setLoading(false) })
    }

    const handleKeyDown = async ({ key }: { key: string }) => {
        if (key === 'Enter') await handleLogin()
    }

    return (
        <div className='user-password-login'>
            <div>
                <Input
                    label='Email'
                    type='email'
                    placeholder='correo@dominio.com'
                    value={data.email}
                    name='email'
                    onChange={onChange}
                    autoComplete='email'
                />
            </div>
            <div>
                <PasswordInput
                    label='Contraseña'
                    value={data.password}
                    name='password'
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    autoComplete='current-password'
                />
            </div>
            <div>
                <button
                    className={`button button--primary ${loading ? 'button--loading' : ''}`}
                    type='submit'
                    disabled={loading}
                    onClick={handleLogin}
                >
                    Iniciar sesión
                </button>
            </div>
        </div>
    )
}

export default UserPasswordLoginButton

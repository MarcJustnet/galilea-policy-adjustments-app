import { UserPasswordLoginButton } from '@/core/auth/components'
import { useAuthStore } from '@/core/auth/store'
import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'

const LoginPage: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    // const [config, setConfig] = useState<Configuration | null>(null)
    const isLogged = useAuthStore((state) => state.isLogged)
    const authError = useAuthStore((state) => state.authError)

    useEffect(() => { if (isLogged) navigate(searchParams.get('backUrl') ?? '/') }, [isLogged, searchParams])

    if (isLogged) {
        return (
            <div className='auth-page loading'>
                {/* Loading spinner handled by CSS */}
            </div>
        )
    }

    return (
        <div className='auth-page'>
            <div className='auth-card'>
                <div className='auth-card__header'>
                    <h1>Regularizaciones Galilea</h1>
                </div>

                <UserPasswordLoginButton />

                <Link to="/auth/forgot_password" className='auth-card__link'>
                    ¿Olvidaste tu contraseña?
                </Link>

                {(Boolean(authError) && typeof authError === 'string') && (
                    <p className='help is-danger'>{authError}</p>
                )}
            </div>
        </div>
    )
}

export default LoginPage

import { Suspense } from 'react'
import Loader from '../Loader'

export interface NotFoundPageProps {
    message?: string
}

const NotFoundPage: React.FC<NotFoundPageProps> = () => {
    return (
        <Suspense fallback={<Loader />}>
            <div style={{
                fontFamily: 'Arial, sans-serif',
                height: 'calc(100dvh - 65px)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f0f0f0',
                color: '#333'
            }}>
                <h1 style={{
                    fontSize: '4rem',
                    marginBottom: '1rem'
                }}>404</h1>
                <h2 style={{
                    fontSize: '2rem',
                    marginBottom: '2rem'
                }}>Página no encontrada</h2>
                <p style={{
                    fontSize: '1.2rem',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>Lo sentimos, la página que estás buscando no existe en el sitio.</p>
            </div>
        </Suspense>
    )
}

export default NotFoundPage

import React from 'react'

export interface LoaderProps {
    size?: 'small' | 'medium' | 'large'
    color?: string
    text?: string
}

const Loader: React.FC<LoaderProps> = ({
    size = 'medium',
    color = '#007bff',
    text = 'Cargando...'
}) => {
    const sizeStyles = {
        small: { width: '20px', height: '20px' },
        medium: { width: '40px', height: '40px' },
        large: { width: '60px', height: '60px' }
    }

    const spinnerStyle = {
        ...sizeStyles[size],
        border: '3px solid #f3f3f3',
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    }

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem'
    }

    return (
        <div style={containerStyle}>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
            <div style={spinnerStyle}></div>
            {text && (
                <p style={{
                    margin: 0,
                    color: '#666',
                    fontSize: '14px',
                    fontFamily: 'Arial, sans-serif'
                }}>
                    {text}
                </p>
            )}
        </div>
    )
}

export default Loader
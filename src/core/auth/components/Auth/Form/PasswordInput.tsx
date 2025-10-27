import Input from '@/core/ui-components/Input'
import { Icons } from '@justnetsystems/ui-icons'
import { useState } from 'react'

const PasswordTypes = Object.freeze({ Password: 'password', Text: 'text' })
type PasswordType = typeof PasswordTypes[keyof typeof PasswordTypes]

export const PasswordInput: React.FC<Input.Props> = ({ placeholder, name, label, className = '', ...props }) => {
    const [passwordType, setPasswordType] = useState<PasswordType>(PasswordTypes.Password)
    const togglePassword = (e: React.MouseEvent) => {
        e.preventDefault()
        setPasswordType(passwordType === PasswordTypes.Password ? PasswordTypes.Text : PasswordTypes.Password)
    }

    return (
        <Input
            label={label ?? 'Contraseña'}
            type={passwordType}
            placeholder={placeholder ?? '••••••••'}
            name={name ?? 'password'}
            addonPosition='internal'
            {...props}
            addons={[
                {
                    content: (
                        <button
                            key='show-password'
                            type='button'
                            onClick={togglePassword}
                            tabIndex={-1}
                            aria-label={passwordType === PasswordTypes.Password ? 'Mostrar contraseña' : 'Ocultar contraseña'}
                        >
                            {passwordType === PasswordTypes.Password ? <Icons.Eye /> : <Icons.EyeSlash />}
                        </button>
                    ),
                    position: 'right'
                }
            ]}
        />
    )
}

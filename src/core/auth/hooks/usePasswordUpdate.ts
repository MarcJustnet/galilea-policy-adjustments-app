import { OnChangeEvent } from "@/core/types"
import type { AuthAPI } from "@/core/ui-service"
import type { CrudStore } from "@/core/ui-store"
import { useState, useMemo, useCallback } from "react"

export const usePasswordUpdate = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<AuthAPI.PasswordUpdateBody>({ password: '', confirmPassword: '' })
    const [done, setDone] = useState(false)

    const onChange = (e: OnChangeEvent) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const validations: Array<CrudStore.Validation<AuthAPI.PasswordUpdateBody>> = useMemo(() => passwordRules.map(({ key, rules }) => {
        const value = data[key]
        const isError = !rules.every((rule) => rule.pass(value, data))
        return { key, isError, error: rules.find((rule) => !rule.pass(value, data))?.message ?? '' }
    }), [data])

    const err = useCallback((key: keyof AuthAPI.PasswordUpdateBody) => {
        const validation = validations.find((validation) => validation.key === key)
        return validation?.error ?? ''
    }, [validations])

    const isValid = useMemo(() => !validations.some((validation) => validation.isError), [validations])

    const isDisabled = useMemo(() => {
        return !data.password || !data.confirmPassword || data.password !== data.confirmPassword || isLoading
    }, [data, isLoading])

    return {
        data,
        isLoading,
        setIsLoading,
        onChange,
        err,
        isValid,
        isDisabled,
        setDone,
        done
    }
}

const rules: Array<CrudStore.Rule<AuthAPI.PasswordUpdateBody, 'password' | 'confirmPassword'>> = [
    {
        pass: (value) => value.length >= 8,
        message: 'La contraseña debe tener al menos 8 caracteres'
    },
    {
        pass: (value) => /[A-Z]/.test(value),
        message: 'La contraseña debe tener al menos una letra mayúscula'
    },
    {
        pass: (value) => /[a-z]/.test(value),
        message: 'La contraseña debe tener al menos una letra minúscula'
    },
    {
        pass: (value) => /\d/.test(value),
        message: 'La contraseña debe tener al menos un número'
    }
]

const passwordRules: Array<CrudStore.KeyRules<AuthAPI.PasswordUpdateBody>> = [
    { key: 'password', rules },
    {
        key: 'confirmPassword',
        rules: [
            ...rules,
            {
                pass: (value, data) => value === data.password,
                message: 'Las contraseñas no coinciden'
            }
        ]
    }
]

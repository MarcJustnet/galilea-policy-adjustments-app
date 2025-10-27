import { isNumber } from '@justnetsystems/utils'
import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'

interface useParamIdProps {
    navigateOnZeroTo?: string | null
    field?: string
}

export const useParamId = ({ navigateOnZeroTo = null, field = 'id' }: useParamIdProps): number => {
    const navigate = useNavigate()
    const params = useParams()

    const realId = useMemo(() => (params[field] && isNumber(params[field])) ? parseInt(params[field] ?? '0') : 0, [params])

    useEffect(() => {
        if (realId === 0 && navigateOnZeroTo) navigate(navigateOnZeroTo)
    }, [realId, navigateOnZeroTo])

    return realId
}

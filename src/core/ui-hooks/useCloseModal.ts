import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

export const useCloseModal = (back: string = '..') => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const backWithActualSearch = useMemo(() => `${back}?${searchParams.toString()}`, [searchParams, back])

    const handleClose = () => { navigate(backWithActualSearch) }
    return { handleClose }
}

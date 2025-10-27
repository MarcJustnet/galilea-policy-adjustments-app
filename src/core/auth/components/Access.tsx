import { IPermission } from '@/config/iam'
import { Suspense, useMemo } from 'react'
import { Navigate, type To } from 'react-router'
import { useAuthStore } from '../store'
import { checkUserPermission } from './check'

interface AccessProps {
    children: React.ReactNode
    permission: IPermission
    loader?: React.ReactNode | null
    navigate?: boolean
    useCondition?: () => boolean
    to?: To
    or?: React.ReactNode
}

export const Access: React.FC<AccessProps> = ({ children, permission, loader = null, useCondition = () => true, navigate = true, to = '/404', or }) => {
    const me = useAuthStore(state => state.data)
    const data = useMemo(() => checkUserPermission(permission, me), [me, permission])
    console.log('Access check:', { permission, hasAccess: data })
    const condition = useCondition()

    if (data && condition) return <Suspense fallback={loader}>{children}</Suspense>
    if (or) return <>{or}</>
    if (navigate) return <Navigate to={to} />
    return null
}

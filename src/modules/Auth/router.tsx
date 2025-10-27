import { NotFoundPage } from '@/components/layouts/NotFound'
import { ForgotPasswordPage, PasswordInitPage, PasswordRestorePage } from '@/core/auth/components'
import { Suspense } from 'react'
import { type RouteObject } from 'react-router'
import { LoginPage } from './views'

export const AuthRouter: RouteObject = {
    path: 'auth',
    children: [
        {
            path: 'login',
            children: [
                {
                    path: '',
                    element: <Suspense><LoginPage /></Suspense>
                },
                {
                    path: '*',
                    element: <Suspense><NotFoundPage /></Suspense>
                }
            ]
        },
        {
            path: 'password_init/:token',
            element: <Suspense><PasswordInitPage /></Suspense>
        },
        {
            path: 'password_restore/:token',
            element: <Suspense><PasswordRestorePage /></Suspense>
        },
        {
            path: 'forgot_password',
            element: <Suspense><ForgotPasswordPage /></Suspense>
        },
        {
            path: '*',
            element: <Suspense><NotFoundPage /></Suspense>
        }
    ]
}

import { Suspense } from 'react'
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { Layout } from './components/layouts/Layout'
import { BackofficeMainLayout } from './components/layouts/MainLayout'
import { NotFoundPage } from './components/layouts/NotFound'
import { AdminRouter } from './modules/Admin/router'
import { AuthRouter } from './modules/Auth/router'
import { PoliciesRouter } from './modules/Policies/router'

export const routes: RouteObject[] = [
    {
        path: "",
        element: <Layout />,
        children: [
            { path: "ok", element: <div>ok</div> },
            AuthRouter,
            {
                path: "",
                element: (
                    // <Access permission={iam.permissions.PolicyAdjustments.HasAccess}>
                    <BackofficeMainLayout />
                    // </Access>
                ),
                children: [
                    AdminRouter,
                    PoliciesRouter,
                    { path: "", element: <Navigate to={PoliciesRouter.path!} /> },
                    { path: "*", element: <Suspense><NotFoundPage /></Suspense> },
                ],
            },
            { path: "*", element: <Suspense><NotFoundPage /></Suspense> },
        ],
    },
]

export const router = createBrowserRouter(routes, { basename: import.meta.env.VITE_BASE_NAME })
export const _navigate = router.navigate.bind(router)

import { Navigate, RouteObject } from "react-router"
import { ToAdjustRouter } from "./ToAdjust/router"

export const PoliciesRouter: RouteObject = {
    path: 'policies',
    children: [
        ToAdjustRouter,
        { path: '', element: <Navigate to={ToAdjustRouter.path!} /> }
    ]
}

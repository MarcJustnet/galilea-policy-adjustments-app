import Loader from "@/components/layouts/Loader"
import { Suspense } from "react"
import { type RouteObject } from "react-router"
import { MailSendersRouter } from "./MailSenders/router"
import { ProfilesRouter } from "./Profiles/router"
import { RolesRouter } from "./Roles/router"
import { UsersRouter } from "./Users/router"
import { AdminPage } from "./view"

export const AdminRouter: RouteObject = {
    path: "admin",
    handle: () => ({ crumb: "Admin" }),
    children: [
        {
            path: "",
            element: <Suspense fallback={<Loader />}><AdminPage /></Suspense>,
        },
        UsersRouter,
        RolesRouter,
        ProfilesRouter,
        MailSendersRouter
    ],
}

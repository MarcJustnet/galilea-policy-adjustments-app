import '@/assets/styles/index.scss'
import { Toaster } from '@justnetsystems/ui-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router"
import { router } from "./router"

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={client}>
        <Toaster autoClose={1000} />
        <RouterProvider router={router} />
    </QueryClientProvider>
)

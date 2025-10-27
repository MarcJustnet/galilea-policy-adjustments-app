import { Outlet } from "react-router"
import Table from "./Table"

const RolesPage: React.FC = () => {
    return (
        <div className="page page--roles">
            <div className="page__content">
                <Table />
            </div>
            <Outlet />
        </div>
    )
}

export default RolesPage

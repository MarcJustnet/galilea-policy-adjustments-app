import { Outlet } from "react-router"
import Table from "./Table"

const PoliciesPage: React.FC = () => {
    return (
        <div className="page page--policies">
            <div className="page__content">
                <Table />
            </div>
            <Outlet />
        </div>
    )
}

export default PoliciesPage

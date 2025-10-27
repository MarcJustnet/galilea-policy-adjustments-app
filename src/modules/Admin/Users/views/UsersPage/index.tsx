import { Outlet } from "react-router"
import Table from "./Table"

const UsersPage: React.FC = () => {
    return (
        <div className="page page--users">
            {/* <div className="page__header">
                <h1>Users</h1>
            </div> */}
            <div className="page__content">
                <Table />
            </div>
            <Outlet />
        </div>
    )
}

export default UsersPage
import { Outlet } from "react-router"
import Table from "./Table"

const ProfilesPage: React.FC = () => {
    return (
        <div className="page page--profiles">
            <div className="page__content">
                <Table />
            </div>
            <Outlet />
        </div>
    )
}

export default ProfilesPage

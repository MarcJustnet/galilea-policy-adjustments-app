import Loader from "@/components/layouts/Loader"
import Message from "@/core/ui-components/Message"
import Modal from "@/core/ui-components/Modal"
import { useState } from "react"
import { useNavigate } from "react-router"
import { RolesHooks } from "../../hooks"
import { RolesStore } from "../../store"
import Form from "./Form"
import PermissionsTab from "./PermissionsTab"

const RolePage: React.FC = () => {
    const navigate = useNavigate()
    const data = RolesHooks.useGetByIdSimple()
    const isLoading = RolesStore.FormSimple(state => state.isLoading)
    const error = RolesStore.FormSimple(state => state.error)
    const [activeTab, setActiveTab] = useState<'info' | 'permissions'>('info')

    const refetchList = RolesStore.Table(state => state.refetch)

    const handleClose = () => {
        refetchList()
        navigate('..')
    }

    if (isLoading) return <Loader />
    if (error) return (
        <div className="page page--role">
            <Message type="danger" message={error.message} />
        </div>
    )
    if (!data) return (
        <div className="page page--role">
            <Message type="warning" message="Role not found" />
        </div>
    )

    return (
        <Modal isOpen={true} handleClose={handleClose}>
            <div className="tabs">
                <div className="tabs__header">
                    <button
                        className={`tabs__tab ${activeTab === 'info' ? 'tabs__tab--active' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        Información
                    </button>
                    <button
                        className={`tabs__tab ${activeTab === 'permissions' ? 'tabs__tab--active' : ''}`}
                        onClick={() => setActiveTab('permissions')}
                    >
                        Permisos
                    </button>
                </div>
                <div className="tabs__content">
                    {activeTab === 'info' && <Form />}
                    {activeTab === 'permissions' && <PermissionsTab roleId={data.id} />}
                </div>
            </div>
        </Modal>
    )
}

export default RolePage

import Loader from "@/components/layouts/Loader"
import Message from "@/core/ui-components/Message"
import Modal from "@/core/ui-components/Modal"
import { useNavigate } from "react-router"
import { UsersHooks } from "../../hooks"
import { UsersStore } from "../../store"
import Form from "./Form"

const UserPage: React.FC = () => {
    const navigate = useNavigate()
    const data = UsersHooks.useGetByIdSimple()
    const isLoading = UsersStore.FormSimple(state => state.isLoading)
    const error = UsersStore.FormSimple(state => state.error)

    const refetchList = UsersStore.Table(state => state.refetch)

    const handleClose = () => {
        refetchList()
        navigate('..')
    }

    if (isLoading) return <Loader />
    if (error) return (
        <div className="page page--user">
            <Message type="danger" message={error.message} />
        </div>
    )
    if (!data) return (
        <div className="page page--user">
            <Message type="warning" message="User not found" />
        </div>
    )

    return (
        <Modal isOpen={true} handleClose={handleClose}>
            <Form />
        </Modal>
    )
}

export default UserPage
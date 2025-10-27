import Loader from "@/components/layouts/Loader"
import Message from "@/core/ui-components/Message"
import Modal from "@/core/ui-components/Modal"
import { useNavigate } from "react-router"
import { ProfilesHooks } from "../../hooks"
import { ProfilesStore } from "../../store"
import Form from "./Form"

const ProfilePage: React.FC = () => {
    const navigate = useNavigate()
    const data = ProfilesHooks.useGetByIdSimple()
    const isLoading = ProfilesStore.FormSimple(state => state.isLoading)
    const error = ProfilesStore.FormSimple(state => state.error)

    const refetchList = ProfilesStore.Table(state => state.refetch)

    const handleClose = () => {
        refetchList()
        navigate('..')
    }

    if (isLoading) return <Loader />
    if (error) return (
        <div className="page page--profile">
            <Message type="danger" message={error.message} />
        </div>
    )
    if (!data) return (
        <div className="page page--profile">
            <Message type="warning" message="Profile not found" />
        </div>
    )

    return (
        <Modal isOpen={true} handleClose={handleClose}>
            <Form />
        </Modal>
    )
}

export default ProfilePage

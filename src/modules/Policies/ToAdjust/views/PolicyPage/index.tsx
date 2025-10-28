import Loader from "@/components/layouts/Loader"
import Message from "@/core/ui-components/Message"
import Modal from "@/core/ui-components/Modal"
import { useNavigate } from "react-router"
import { PoliciesToAdjustHooks } from "../../hooks"
import { PoliciesToAdjustStore } from "../../store"
import Form from "./Form"

const PolicyPage: React.FC = () => {
    const navigate = useNavigate()
    const data = PoliciesToAdjustHooks.useGetByIdSimple()
    const isLoading = PoliciesToAdjustStore.FormSimple(state => state.isLoading)
    const error = PoliciesToAdjustStore.FormSimple(state => state.error)

    const refetchList = PoliciesToAdjustStore.Table(state => state.refetch)

    const handleClose = () => {
        refetchList()
        navigate('..')
    }

    if (isLoading) return <Loader />
    if (error) return (
        <div className="page page--policy">
            <Message type="danger" message={error.message} />
        </div>
    )
    if (!data) return (
        <div className="page page--policy">
            <Message type="warning" message="Policy not found" />
        </div>
    )

    return (
        <Modal isOpen={true} handleClose={handleClose}>
            <Form />
        </Modal>
    )
}

export default PolicyPage

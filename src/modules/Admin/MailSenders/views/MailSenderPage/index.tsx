import Loader from "@/components/layouts/Loader"
import Message from "@/core/ui-components/Message"
import Modal from "@/core/ui-components/Modal"
import { useNavigate } from "react-router"
import { MailSendersHooks } from "../../hooks"
import { MailSendersStore } from "../../store"
import Form from "./Form"

const MailSenderPage: React.FC = () => {
    const navigate = useNavigate()
    const data = MailSendersHooks.useGetByIdSimple()
    const isLoading = MailSendersStore.FormSimple(state => state.isLoading)
    const error = MailSendersStore.FormSimple(state => state.error)

    if (isLoading) return <Loader />
    if (error) return (
        <div className="page page--mail-sender">
            <Message type="danger" message={error.message} />
        </div>
    )
    if (!data) return (
        <div className="page page--mail-sender">
            <Message type="warning" message="Mail sender not found" />
        </div>
    )

    return (
        <Modal isOpen={true} handleClose={() => navigate('..')}>
            <Form />
        </Modal>
    )
}

export default MailSenderPage

import Table from "./Table"

const MailSendersPage: React.FC = () => {
    return (
        <div className="page page--mail-senders">
            <div className="page__header">
                <h1>Mail Senders</h1>
            </div>
            <div className="page__content">
                <Table />
            </div>
        </div>
    )
}

export default MailSendersPage

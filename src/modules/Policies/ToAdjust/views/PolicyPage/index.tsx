import Loader from "@/components/layouts/Loader"
import Message from "@/core/ui-components/Message"
import { Icons } from "@justnetsystems/ui-icons"
import { useNavigate } from "react-router"
import { PoliciesToAdjustHooks } from "../../hooks"
import { PoliciesToAdjustStore } from "../../store"

const PolicyPage: React.FC = () => {
    const navigate = useNavigate()
    const data = PoliciesToAdjustHooks.useGetByIdSimple()
    const isLoading = PoliciesToAdjustStore.FormSimple(state => state.isLoading)
    const error = PoliciesToAdjustStore.FormSimple(state => state.error)

    const handleClose = () => {
        navigate('..')
    }

    if (isLoading) return (
        <div className="modal modal--policy">
            <div className="modal__content">
                <Loader />
            </div>
        </div>
    )

    if (error) return (
        <div className="modal modal--policy">
            <div className="modal__content">
                <Message type="danger" message={error.message} />
            </div>
        </div>
    )

    if (!data) return null

    return (
        <div className="modal modal--policy">
            <div className="modal__backdrop" onClick={handleClose} />
            <div className="modal__content">
                <div className="modal__header">
                    <h2>Póliza {data.POLIZA_CIA}</h2>
                    <button className="modal__close" onClick={handleClose}>
                        <Icons.X />
                    </button>
                </div>
                <div className="modal__body">
                    <div className="form">
                        <div className="form__section">
                            <h3>Información General</h3>
                            <div className="form__row">
                                <div className="form__field">
                                    <label>Número</label>
                                    <input type="text" value={data.NUMERO} disabled className="form__input" />
                                </div>
                                <div className="form__field">
                                    <label>Póliza CIA</label>
                                    <input type="text" value={data.POLIZA_CIA} disabled className="form__input" />
                                </div>
                            </div>
                            <div className="form__row">
                                <div className="form__field">
                                    <label>Cliente</label>
                                    <input type="text" value={data.CLIENTE} disabled className="form__input" />
                                </div>
                                <div className="form__field">
                                    <label>Riesgo</label>
                                    <input type="text" value={data.RIESGO || '-'} disabled className="form__input" />
                                </div>
                            </div>
                        </div>

                        <div className="form__section">
                            <h3>Información Económica</h3>
                            <div className="form__row">
                                <div className="form__field">
                                    <label>Prima Neta</label>
                                    <input type="text" value={`${data.PRIMA_NETA.toFixed(2)} €`} disabled className="form__input" />
                                </div>
                                <div className="form__field">
                                    <label>Prima Total</label>
                                    <input type="text" value={`${data.PRIMA_TOTAL.toFixed(2)} €`} disabled className="form__input" />
                                </div>
                            </div>
                            <div className="form__row">
                                <div className="form__field">
                                    <label>Comisión</label>
                                    <input type="text" value={`${data.COMISION.toFixed(2)} €`} disabled className="form__input" />
                                </div>
                                <div className="form__field">
                                    <label>Impuestos</label>
                                    <input type="text" value={`${data.IMPUESTOS.toFixed(2)} €`} disabled className="form__input" />
                                </div>
                            </div>
                        </div>

                        <div className="form__section">
                            <h3>Fechas</h3>
                            <div className="form__row">
                                <div className="form__field">
                                    <label>Fecha Efecto</label>
                                    <input
                                        type="text"
                                        value={data.FECHA_EFECTO ? new Date(data.FECHA_EFECTO).toLocaleDateString() : '-'}
                                        disabled
                                        className="form__input"
                                    />
                                </div>
                                <div className="form__field">
                                    <label>Fecha Vencimiento</label>
                                    <input
                                        type="text"
                                        value={data.FECHA_VMT_POL ? new Date(data.FECHA_VMT_POL).toLocaleDateString() : '-'}
                                        disabled
                                        className="form__input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal__footer">
                    <button className="button button--secondary" onClick={handleClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PolicyPage

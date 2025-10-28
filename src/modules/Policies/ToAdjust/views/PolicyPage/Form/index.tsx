import Input from "@/core/ui-components/Input"
import { useNavigate } from "react-router"
import { PoliciesToAdjustStore } from "../../../store"

const Form: React.FC = () => {
    const newData = PoliciesToAdjustStore.FormSimple(state => state.newData)
    const onChange = PoliciesToAdjustStore.FormSimple(state => state.onChange)

    if (!newData) return null

    return (
        <form className="form form--policies" onSubmit={(e) => e.preventDefault()}>
            <div className="form__section">
                <h3 className="form__section__title">Información General</h3>
                <div className="form__row">
                    <Input
                        label="Número"
                        name="NUMERO"
                        value={newData.NUMERO}
                        onChange={onChange}
                        disabled
                    />
                    <Input
                        label="Póliza CIA"
                        name="POLIZA_CIA"
                        value={newData.POLIZA_CIA}
                        onChange={onChange}
                        disabled
                    />
                </div>
                <div className="form__row">
                    <Input
                        label="Cliente"
                        name="CLIENTE"
                        value={newData.CLIENTE}
                        onChange={onChange}
                        disabled
                    />
                    <Input
                        label="Riesgo"
                        name="RIESGO"
                        value={newData.RIESGO || '-'}
                        onChange={onChange}
                        disabled
                    />
                </div>
            </div>

            <div className="form__section">
                <h3 className="form__section__title">Información Económica</h3>
                <div className="form__row">
                    <Input
                        label="Prima Neta"
                        name="PRIMA_NETA"
                        value={`${newData.PRIMA_NETA.toFixed(2)} €`}
                        onChange={onChange}
                        disabled
                    />
                    <Input
                        label="Prima Total"
                        name="PRIMA_TOTAL"
                        value={`${newData.PRIMA_TOTAL.toFixed(2)} €`}
                        onChange={onChange}
                        disabled
                    />
                </div>
                <div className="form__row">
                    <Input
                        label="Comisión"
                        name="COMISION"
                        value={`${newData.COMISION.toFixed(2)} €`}
                        onChange={onChange}
                        disabled
                    />
                    <Input
                        label="Impuestos"
                        name="IMPUESTOS"
                        value={`${newData.IMPUESTOS.toFixed(2)} €`}
                        onChange={onChange}
                        disabled
                    />
                </div>
            </div>

            <div className="form__section">
                <h3 className="form__section__title">Fechas</h3>
                <div className="form__row">
                    <Input
                        label="Fecha Efecto"
                        name="FECHA_EFECTO"
                        value={newData.FECHA_EFECTO ? new Date(newData.FECHA_EFECTO).toLocaleDateString() : '-'}
                        onChange={onChange}
                        disabled
                    />
                    <Input
                        label="Fecha Vencimiento"
                        name="FECHA_VMT_POL"
                        value={newData.FECHA_VMT_POL ? new Date(newData.FECHA_VMT_POL).toLocaleDateString() : '-'}
                        onChange={onChange}
                        disabled
                    />
                </div>
            </div>

            <div className="form__footer">
                <CloseButton />
            </div>
        </form>
    )
}

const CloseButton: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="form__actions">
            <button
                type="button"
                className="button button--secondary"
                onClick={() => navigate('..')}
            >
                Cerrar
            </button>
        </div>
    )
}

export default Form
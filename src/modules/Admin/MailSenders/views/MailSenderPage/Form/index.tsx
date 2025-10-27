import Input from "@/core/ui-components/Input"
import { toast } from "@justnetsystems/ui-toast"
import { areEqual } from "@justnetsystems/utils"
import { useEffect } from "react"
import { MailSendersHooks } from "../../../hooks"
import { MailSendersStore } from "../../../store"

const Form: React.FC = () => {
    const newData = MailSendersStore.FormSimple(state => state.newData)
    const onChange = MailSendersStore.FormSimple(state => state.onChange)
    const error = MailSendersStore.FormSimple(state => state.error)

    if (!newData) return null

    return (
        <form className="form form--mail-senders" onSubmit={(e) => e.preventDefault()}>
            <div className="form__section">
                <h3 className="form__section__title">Información Básica</h3>
                <div className="form__row">
                    <Input
                        label="Nombre"
                        name="name"
                        value={newData.name}
                        onChange={onChange}
                        placeholder="e.g., Main SMTP Server"
                    />
                    <Input
                        label="Usuario"
                        name="user"
                        type="email"
                        value={newData.user}
                        onChange={onChange}
                        placeholder="email@example.com"
                    />
                </div>
            </div>

            <div className="form__section">
                <h3 className="form__section__title">Configuración del Servidor</h3>
                <div className="form__row">
                    <Input
                        label="Host"
                        name="host"
                        value={newData.host}
                        onChange={onChange}
                        placeholder="smtp.example.com"
                    />
                    <Input
                        label="Puerto"
                        name="port"
                        type="number"
                        value={String(newData.port)}
                        onChange={onChange}
                        placeholder="587"
                    />
                    <Input
                        label="Contraseña"
                        name="pass"
                        type="password"
                        value={newData.pass}
                        onChange={onChange}
                        placeholder="••••••••"
                    />
                </div>
                <div className="form__row">
                    <div className="form__group">
                        <label className="form__label">
                            <input
                                type="checkbox"
                                name="secure"
                                checked={newData.secure ?? false}
                                onChange={onChange}
                            />
                            {' '}Conexión Segura (TLS)
                        </label>
                    </div>
                </div>
            </div>

            <div className="form__section">
                <h3 className="form__section__title">Microsoft Azure AD (Opcional)</h3>
                <p className="form__section__description">
                    Configura estos ajustes si usas autenticación Microsoft 365 / Azure AD
                </p>
                <div className="form__row">
                    <Input
                        label="MSAL Client ID"
                        name="msalClientId"
                        value={newData.msalClientId ?? ''}
                        onChange={onChange}
                        placeholder="00000000-0000-0000-0000-000000000000"
                    />
                    <Input
                        label="MSAL Tenant ID"
                        name="msalTenantId"
                        value={newData.msalTenantId ?? ''}
                        onChange={onChange}
                        placeholder="00000000-0000-0000-0000-000000000000"
                    />
                    <Input
                        label="MSAL Client Secret"
                        name="msalClientSecret"
                        type="password"
                        value={newData.msalClientSecret ?? ''}
                        onChange={onChange}
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div className="form__section">
                <div className="form__row">
                    <div className="form__group">
                        <label className="form__label">
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={newData.isDefault ?? false}
                                onChange={onChange}
                            />
                            {' '}Establecer como remitente predeterminado
                        </label>
                    </div>
                </div>
            </div>

            <div className="form__footer">
                <SaveButton />
            </div>
        </form>
    )
}

const SaveButton: React.FC = () => {
    const data = MailSendersStore.FormSimple(state => state.data)
    const newData = MailSendersStore.FormSimple(state => state.newData)
    const setData = MailSendersStore.FormSimple(state => state.setData)
    const isEdited = MailSendersStore.FormSimple(state => state.isEdited)
    const setIsEdited = MailSendersStore.FormSimple(state => state.setIsEdited)
    const isValid = MailSendersStore.FormSimple(state => state.isValid)

    const { create, isLoading, update } = MailSendersHooks.useMutate()

    useEffect(() => {
        setIsEdited(!areEqual(newData, data))
    }, [newData, data, setIsEdited])

    const onSuccess = () => {
        setData(newData)
        setIsEdited(false)
        toast('Registro actualizado correctamente', { type: 'success' })
    }

    const onError = () => {
        // Handle error (e.g., show error message)
    }

    const onClick = () => {
        if (!data || !newData) return
        if (!isEdited || !isValid || isLoading) return
        if (data.id) update(newData, { onSuccess, onError })
        else create(newData, { onSuccess, onError })
    }

    return (
        <div className="form__actions">
            <button
                type="button"
                disabled={!isEdited || !isValid || isLoading}
                className={`button button--primary ${isLoading ? 'button--loading' : ''}`}
                onClick={onClick}
            >
                {isLoading ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <button
                type="button"
                className="button button--secondary"
                onClick={() => window.history.back()}
            >
                Cerrar
            </button>
        </div>
    )
}

export default Form

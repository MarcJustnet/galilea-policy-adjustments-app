import Input from "@/core/ui-components/Input"
import { areEqual } from "@justnetsystems/utils"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { RolesHooks } from "../../../hooks"
import { RolesStore } from "../../../store"

const Form: React.FC = () => {
    const newData = RolesStore.FormSimple(state => state.newData)
    const onChange = RolesStore.FormSimple(state => state.onChange)

    if (!newData) return null

    return (
        <form className="form form--roles" onSubmit={(e) => e.preventDefault()}>
            <div className="form__section">
                <h3 className="form__section__title">Información del Rol</h3>
                <div className="form__row">
                    <Input
                        label="Código"
                        name="code"
                        value={newData.code}
                        onChange={onChange}
                    />
                    <Input
                        label="Nombre"
                        name="name"
                        value={newData.name}
                        onChange={onChange}
                    />
                </div>
                <div className="form__row">
                    <Input
                        label="Descripción"
                        name="description"
                        value={newData.description || ''}
                        onChange={onChange}
                    />
                </div>
                <div className="form__row">
                    <label className="form__label">
                        <input
                            type="checkbox"
                            name="isSystemRole"
                            checked={newData.isSystemRole}
                            onChange={onChange}
                        />
                        <span style={{ marginLeft: '0.5rem' }}>Rol de sistema</span>
                    </label>
                </div>
            </div>

            <div className="form__footer">
                <SaveButton />
            </div>
        </form>
    )
}

const SaveButton: React.FC = () => {
    const navigate = useNavigate()

    const data = RolesStore.FormSimple(state => state.data)
    const newData = RolesStore.FormSimple(state => state.newData)
    const setIsEdited = RolesStore.FormSimple(state => state.setIsEdited)
    const isEdited = RolesStore.FormSimple(state => state.isEdited)
    const isValid = RolesStore.FormSimple(state => state.isValid)

    const { create, isLoading, update } = RolesHooks.useMutateSimple()

    useEffect(() => {
        setIsEdited(!areEqual(newData, data))
    }, [newData, data, setIsEdited])

    const onClick = () => {
        if (!data || !newData) return
        if (!isEdited || !isValid || isLoading) return
        if (data.id) update(newData)
        else create(newData)
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
                onClick={() => navigate('..')}
            >
                Cerrar
            </button>
        </div>
    )
}

export default Form

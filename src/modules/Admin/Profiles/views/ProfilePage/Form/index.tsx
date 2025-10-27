import Input from "@/core/ui-components/Input"
import { areEqual } from "@justnetsystems/utils"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { ProfilesHooks } from "../../../hooks"
import { ProfilesStore } from "../../../store"

const Form: React.FC = () => {
    const newData = ProfilesStore.FormSimple(state => state.newData)
    const onChange = ProfilesStore.FormSimple(state => state.onChange)

    if (!newData) return null

    return (
        <form className="form form--profiles" onSubmit={(e) => e.preventDefault()}>
            <div className="form__section">
                <h3 className="form__section__title">Información del Perfil</h3>
                <div className="form__row">
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
            </div>

            <div className="form__footer">
                <SaveButton />
            </div>
        </form>
    )
}

const SaveButton: React.FC = () => {
    const navigate = useNavigate()

    const data = ProfilesStore.FormSimple(state => state.data)
    const newData = ProfilesStore.FormSimple(state => state.newData)
    const setIsEdited = ProfilesStore.FormSimple(state => state.setIsEdited)
    const isEdited = ProfilesStore.FormSimple(state => state.isEdited)
    const isValid = ProfilesStore.FormSimple(state => state.isValid)

    const { create, isLoading, update } = ProfilesHooks.useMutateSimple()

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

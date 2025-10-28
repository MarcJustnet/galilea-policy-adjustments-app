import { UpdatePasswordButton } from "@/core/auth/components"
import Input from "@/core/ui-components/Input"
import { areEqual } from "@justnetsystems/utils"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { UsersHooks } from "../../../hooks"
import { UsersService } from "../../../service"
import { UsersStore } from "../../../store"

const Form: React.FC = () => {
    const newData = UsersStore.FormSimple(state => state.newData)
    const onChange = UsersStore.FormSimple(state => state.onChange)

    if (!newData) return null

    return (
        <form className="form form--users" onSubmit={(e) => e.preventDefault()}>
            <div className="form__section">
                <h3 className="form__section__title">Información del Usuario</h3>
                <div className="form__row">
                    <Input
                        label="Nombre"
                        name="name"
                        value={newData.name}
                        onChange={onChange}
                    />
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={newData.email}
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

    const data = UsersStore.FormSimple(state => state.data)
    const newData = UsersStore.FormSimple(state => state.newData)
    const isEdited = UsersStore.FormSimple(state => state.isEdited)
    const setIsEdited = UsersStore.FormSimple(state => state.setIsEdited)
    const isValid = UsersStore.FormSimple(state => state.isValid)

    const { create, isLoading, update } = UsersHooks.useMutateSimple()

    useEffect(() => {
        console.log('Comparing data for isEdited:', { data, newData })
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
            {Boolean(newData && Boolean(newData?.id)) && <UpdatePasswordButton data={newData!} Service={UsersService} />}
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
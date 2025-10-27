import { usePrompt } from '@/core/ui-hooks'
import { useMemo } from 'react'

interface Block {
    block: boolean
    message: string
    callback: () => void
}

type Blocker = () => Block

export const Prompt: React.FC = () => {
    // const inventoryLinesIsEdited = useInventoryLinesPrompt(state => state.isEdited)
    // const inventoryLinesSetIsEdited = useInventoryLinesPrompt(state => state.setIsEdited)

    window.onbeforeunload = function () {
        // if (inventoryLinesIsEdited) inventoryLinesSetIsEdited(false)
        window.history.replaceState({}, '')
    }

    const blockers: Blocker[] = useMemo(() => [
        // () => ({
        //     block: inventoryLinesIsEdited,
        //     message: 'Tienes cambios sin guardar en las líneas de inventario. ¿Estás seguro de que quieres salir?',
        //     callback: () => { inventoryLinesSetIsEdited(false) }
        // }),
    ], [
        // inventoryLinesIsEdited, inventoryLinesSetIsEdited
    ])

    return usePrompt({ blockers })
}

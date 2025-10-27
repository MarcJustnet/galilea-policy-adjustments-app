import { Icons } from '@justnetsystems/ui-icons'
import { useCallback, useEffect, useState } from 'react'
import { useBlocker } from 'react-router'

export interface Block {
    block: boolean
    message: string
    callback: () => void
}

export type Blocker = () => Block

interface UsePromptProps {
    blockers: Blocker[]
}

export const usePrompt = ({ blockers }: UsePromptProps) => {
    const [showModal, setShowModal] = useState(false)
    const [currentBlock, setCurrentBlock] = useState<Block | null>(null)

    // Verificar si algún blocker está activo
    const shouldBlock = useCallback(() => {
        for (const blocker of blockers) {
            const blocked = blocker()
            if (blocked.block) {
                return true
            }
        }
        return false
    }, [blockers])

    // Usar el blocker nativo de React Router
    const blocker = useBlocker(shouldBlock)

    useEffect(() => {
        if (blocker.state === 'blocked') {
            console.log('Navigation blocked by React Router')

            // Encontrar el blocker activo
            for (const blockerFn of blockers) {
                const blocked = blockerFn()
                if (blocked.block) {
                    setCurrentBlock(blocked)
                    setShowModal(true)
                    return
                }
            }
        }
    }, [blocker.state, blockers])

    const handleConfirm = () => {
        if (currentBlock) {
            currentBlock.callback()
        }
        setShowModal(false)
        setCurrentBlock(null)
        blocker.proceed?.()
    }

    const handleCancel = () => {
        setShowModal(false)
        setCurrentBlock(null)
        blocker.reset?.()
    }

    return (
        <div className={`modal ${showModal ? 'modal--open' : ''}`}>
            <div className="modal__backdrop" onClick={handleCancel}></div>
            <div className='modal__content'>
                <div className="modal__header">
                    <Icons.Exclamation style={{ fontSize: '3rem', color: '#f59e0b' }} />
                    <h2 className="modal__title">¿Estás seguro?</h2>
                    <p className="modal__description">{currentBlock?.message}</p>
                </div>
                <div className="modal__body">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                        <button onClick={handleConfirm} className='button button--danger button--large'>
                            Sí, salir
                        </button>
                        <button onClick={handleCancel} className='button button--secondary button--large'>
                            No, quedarme
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

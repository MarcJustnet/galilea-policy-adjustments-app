import { useEffect } from "react"

namespace Modal {
    export interface Props {
        isOpen: boolean
        handleClose: () => void
        children: React.ReactNode
    }
}

const Modal: React.FC<Modal.Props> = ({ isOpen, handleClose, children }) => {
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            return () => { document.body.style.overflow = originalOverflow }
        }
    }, [isOpen])

    return (
        <div className={`modal ${isOpen ? 'modal--open' : ''}`}>
            <div className='modal__backdrop' onClick={handleClose} />
            <div className='modal__content'>
                {children}
            </div>
        </div>
    )
}

export default Modal
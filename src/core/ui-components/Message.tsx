import { Icons } from '@justnetsystems/ui-icons'
import { ReactNode } from 'react'

namespace Message {
    export interface Props {
        type?: 'info' | 'success' | 'warning' | 'danger'
        message?: string
        children?: ReactNode
        title?: string
        icon?: boolean
        closable?: boolean
        onClose?: () => void
    }
}

const Message: React.FC<Message.Props> = ({
    type = 'info',
    message,
    children,
    title,
    icon = true,
    closable = false,
    onClose
}) => {
    const icons = {
        info: <Icons.Info />,
        success: <Icons.Check />,
        warning: <Icons.TriangleExclamation />,
        danger: <Icons.Exclamation />
    }

    return (
        <div className={`message message--${type}`} role="alert">
            {closable && (
                <button
                    className="message__close"
                    onClick={onClose}
                    aria-label="Cerrar mensaje"
                >
                    ✕
                </button>
            )}

            <div className="message__content">
                {icon && (
                    <span className="message__icon" aria-hidden="true">
                        {icons[type]}
                    </span>
                )}

                <div className="message__body">
                    {title && <h4 className="message__title">{title}</h4>}
                    {message && <p className="message__text">{message}</p>}
                    {children && <div className="message__children">{children}</div>}
                </div>
            </div>
        </div>
    )
}

export default Message
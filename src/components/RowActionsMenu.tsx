import { useClickOutside } from "@/core/ui-hooks"
import { useEffect, useRef, useState } from "react"

namespace RowActionsMenu {
    export interface Props {
        children?: React.ReactNode
    }
}

const RowActionsMenu: React.FC<RowActionsMenu.Props> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const menuRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useClickOutside([menuRef], () => setIsOpen(false), [isOpen])

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setPosition({
                top: rect.bottom + 4,
                left: rect.right - 160 // 160px = 10rem (min-width del dropdown)
            })
        }
    }, [isOpen])

    const handleDropdownClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement
        if (target.classList.contains('x-onclick') || target.closest('.x-onclick')) {
            setIsOpen(false)
        }
    }

    return (
        <div className="table__actions-menu" ref={menuRef}>
            <button
                ref={buttonRef}
                className="button button--icon button--ghost button--small"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Actions"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                </svg>
            </button>
            {isOpen && (
                <div
                    className="table__actions-dropdown table__actions-dropdown--fixed"
                    style={{ top: `${position.top}px`, left: `${position.left}px` }}
                    onClick={handleDropdownClick}
                >
                    {children}
                </div>
            )}
        </div>
    )
}

export default RowActionsMenu

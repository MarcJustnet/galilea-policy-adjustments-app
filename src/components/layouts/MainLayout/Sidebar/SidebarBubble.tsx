import { useAuthContext } from "@/core/auth/context"
import { useClickOutside } from "@/core/ui-hooks"
import { useRef, useState } from "react"

export const SidebarBubble: React.FC = () => {
    const bubbleRef = useRef(null)
    const [isActive, setIsActive] = useState<boolean>(false)
    const { logout, me } = useAuthContext()

    useClickOutside([bubbleRef], () => { setIsActive(false) })

    return (
        <div ref={bubbleRef} className="sidebar__bubble">
            <span
                className="name"
                onClick={() => {
                    setIsActive(!isActive)
                }}
            >
                {me ? me.name.slice(0, 2).toUpperCase() : "??"}
            </span>
            <div className={`sidebar__info ${isActive ? "active" : ""}`}>
                <ul>
                    <li className="logout">
                        <span
                            onClick={() => {
                                logout()
                            }}
                        >
                            Logout
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

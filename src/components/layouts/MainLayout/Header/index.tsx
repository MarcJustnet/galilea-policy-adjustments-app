import { SidebarBubble } from "../Sidebar/SidebarBubble"

export const Header: React.FC = () => {
    return (
        <header className="header">
            <span className="logo">
                <img src="/logo.png" alt="logo" />
            </span>
            <SidebarBubble />
        </header>
    )
}

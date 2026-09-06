import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    PanelLeftClose,
    PanelLeftOpen,
    MessageSquarePlus,
    FolderGit2,
    LogOut,
    Trash2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

function getInitials(name = "") {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Sidebar = ({ onNewChat, onRepoSelect }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { user, loading, logout } = useAuth();

    const repositories = user?.repositories
        ? Object.entries(user.repositories)
        : [];

    const displayName = user?.name || user?.githubUsername || "User";
    const initials = getInitials(displayName);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        navigate("/");
    };

    const handleDeleteAccount = () => {
        setMenuOpen(false);
        console.log("Delete account");
    };

    return (
        <aside className={`sidebar ${isCollapsed ? "sidebar-collapsed" : ""}`}>
            <div className="sidebar-header">
                <Link to="/home" className="sidebar-brand">
                    <div className="sidebar-logo">CB</div>
                    {!isCollapsed && <span>CodeBifrost</span>}
                </Link>
                <button
                    className="sidebar-toggle"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed
                        ? <PanelLeftOpen size={18} />
                        : <PanelLeftClose size={18} />
                    }
                </button>
            </div>
            <button
                className="sidebar-new-chat"
                title={isCollapsed ? "New chat" : ""}
                onClick={onNewChat}
            >
                <MessageSquarePlus size={18} />
                {!isCollapsed && <span>New Chat</span>}
            </button>
            {!isCollapsed && (
                <div className="sidebar-section">
                    <span className="sidebar-section-title">Repositories</span>
                    <div className="sidebar-repositories">
                        {loading && (
                            <span className="sidebar-empty">Loading…</span>
                        )}
                        {!loading && repositories.length === 0 && (
                            <span className="sidebar-empty">No repositories yet.</span>
                        )}
                        {!loading && repositories.map(([name, url]) => (
                            <button
                                className="sidebar-repo"
                                key={name}
                                title={url}
                                onClick={() => onRepoSelect(url)}
                            >
                                <FolderGit2 className="repo-icon" size={17} />
                                <span>{name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <div className="sidebar-bottom" ref={menuRef}>\
                {menuOpen && (
                    <div className="sidebar-popover">
                        <button className="sidebar-popover-item" onClick={handleLogout}>
                            <LogOut size={15} />
                            <span>Logout</span>
                        </button>
                        <button
                            className="sidebar-popover-item sidebar-popover-danger"
                            onClick={handleDeleteAccount}
                        >
                            <Trash2 size={15} />
                            <span>Delete account</span>
                        </button>
                    </div>
                )}
                <button
                    className="sidebar-user"
                    onClick={() => setMenuOpen((o) => !o)}
                    title={isCollapsed ? displayName : "Account options"}
                >
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={displayName}
                            className="sidebar-avatar sidebar-avatar-img"
                        />
                    ) : (
                        <div className="sidebar-avatar">{initials}</div>
                    )}
                    {!isCollapsed && (
                        <span className="sidebar-username">{displayName}</span>
                    )}
                </button>

            </div>

        </aside>
    );
};

export default Sidebar;
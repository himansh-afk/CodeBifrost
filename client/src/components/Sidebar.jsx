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
import logo from "../assets/codebifrost-logo.svg";
import "./Sidebar.css";

function getInitials(name = "") {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
        return parts[0][0]?.toUpperCase() ?? "?";
    }
    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
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
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) {
            document.addEventListener(
                "mousedown",
                handleClickOutside
            );
        }
        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [menuOpen]);
    const handleLogout = () => {
        setMenuOpen(false);
        logout();
        navigate("/");
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account?"
        );
        if (!confirmed) return;
        setMenuOpen(false);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                "http://localhost:5000/api/user/me",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete account"
                );
            }
            logout();
            navigate("/");
        } catch (error) {
            console.error(
                "Delete account error:",
                error
            );
            alert(
                error.message ||
                "Failed to delete account"
            );
        }
    };
    return (
        <aside
            className={`sidebar ${isCollapsed
                ? "sidebar-collapsed"
                : ""
                }`}
        >
            <div className="sidebar-header">
                <Link
                    to="/home"
                    className="sidebar-brand"
                >
                    <img
                        src={logo}
                        alt="CodeBifrost"
                        className="sidebar-logo"
                    />

                    {!isCollapsed && (
                        <span>
                            CodeBifrost
                        </span>
                    )}
                </Link>
                <button
                    className="sidebar-toggle"
                    onClick={() =>
                        setIsCollapsed(!isCollapsed)
                    }
                    aria-label={
                        isCollapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                >
                    {isCollapsed ? (
                        <PanelLeftOpen size={18} />
                    ) : (
                        <PanelLeftClose size={18} />
                    )}
                </button>
            </div>
            <button
                className="sidebar-new-chat"
                title={
                    isCollapsed
                        ? "New chat"
                        : ""
                }
                onClick={onNewChat}
            >
                <MessageSquarePlus size={18} />
                {!isCollapsed && (
                    <span>
                        New Chat
                    </span>
                )}
            </button>
            {!isCollapsed && (
                <div className="sidebar-section">
                    <span className="sidebar-section-title">
                        Repositories
                    </span>
                    <div className="sidebar-repositories">
                        {loading && (
                            <span className="sidebar-empty">
                                Loading…
                            </span>
                        )}
                        {!loading &&
                            repositories.length === 0 && (
                                <span className="sidebar-empty">
                                    No repositories yet.
                                </span>
                            )}
                        {!loading &&
                            repositories.map(
                                ([name, url]) => (
                                    <button
                                        className="sidebar-repo"
                                        key={name}
                                        title={url}
                                        onClick={() =>
                                            onRepoSelect(url)
                                        }
                                    >
                                        <FolderGit2
                                            className="repo-icon"
                                            size={17}
                                        />
                                        <span>
                                            {name}
                                        </span>
                                    </button>
                                )
                            )}
                    </div>
                </div>
            )}
            <div
                className="sidebar-bottom"
                ref={menuRef}
            >
                {!isCollapsed && menuOpen && (
                    <div className="sidebar-popover">
                        <button
                            className="sidebar-popover-item"
                            onClick={handleLogout}
                        >
                            <LogOut size={15} />

                            <span>
                                Logout
                            </span>
                        </button>
                        <button
                            className="sidebar-popover-item sidebar-popover-danger"
                            onClick={
                                handleDeleteAccount
                            }
                        >
                            <Trash2 size={15} />
                            <span>
                                Delete account
                            </span>
                        </button>
                    </div>
                )}
                {!isCollapsed ? (
                    <button
                        className="sidebar-user"
                        onClick={() =>
                            setMenuOpen(
                                (open) => !open
                            )
                        }
                        title="Account options"
                    >
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={displayName}
                                className="sidebar-avatar sidebar-avatar-img"
                            />
                        ) : (
                            <div className="sidebar-avatar">
                                {initials}
                            </div>
                        )}
                        <span className="sidebar-username">
                            {displayName}
                        </span>
                    </button>
                ) : (
                    <div
                        className="sidebar-user sidebar-user-static"
                        aria-hidden="true"
                    >
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt=""
                                className="sidebar-avatar sidebar-avatar-img"
                            />
                        ) : (
                            <div className="sidebar-avatar">
                                {initials}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
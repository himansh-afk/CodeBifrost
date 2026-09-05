import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    PanelLeftClose,
    PanelLeftOpen,
    MessageSquarePlus,
    FolderGit2
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    const repositories = [
        "Repo 1",
        "Repo 2",
        "Repo 3"
    ];

    return (
        <aside
            className={`sidebar ${isCollapsed ? "sidebar-collapsed" : ""
                }`}
        >

            {/* ─── Header ─────────────────────────────────────────────── */}
            <div className="sidebar-header">

                <Link to="/home" className="sidebar-brand">
                    <div className="sidebar-logo">
                        CB
                    </div>

                    {!isCollapsed && (
                        <span>CodeBifrost</span>
                    )}
                </Link>

                <button
                    className="sidebar-toggle"
                    onClick={() => setIsCollapsed(!isCollapsed)}
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


            {/* ─── New Chat ──────────────────────────────────────────── */}
            <button
                className="sidebar-new-chat"
                title={isCollapsed ? "New chat" : ""}
            >
                <MessageSquarePlus size={18} />

                {!isCollapsed && (
                    <span>New Chat</span>
                )}
            </button>


            {/* ─── Repositories ─────────────────────────────────────── */}
            {!isCollapsed && (
                <div className="sidebar-section">

                    <span className="sidebar-section-title">
                        Repositories
                    </span>

                    <div className="sidebar-repositories">

                        {repositories.map((repo) => (
                            <button
                                className="sidebar-repo"
                                key={repo}
                            >
                                <FolderGit2
                                    className="repo-icon"
                                    size={17}
                                />

                                <span>{repo}</span>
                            </button>
                        ))}

                    </div>

                </div>
            )}


            {/* ─── Bottom ────────────────────────────────────────────── */}
            <div className="sidebar-bottom">

                <button
                    className="sidebar-user"
                    title={isCollapsed ? "Account" : ""}
                >
                    <div className="sidebar-avatar">
                        U
                    </div>

                    {!isCollapsed && (
                        <span className="sidebar-username">
                            Username
                        </span>
                    )}
                </button>

                {!isCollapsed && (
                    <button
                        className="sidebar-logout"
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/");
                        }}
                    >
                        <span>Logout</span>
                    </button>
                )}

            </div>

        </aside>
    );
};

export default Sidebar;
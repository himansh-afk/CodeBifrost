import { Link, useNavigate, useLocation } from "react-router-dom"
import "./Navbar.css";
import logo from "../assets/codebifrost-logo.svg";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem("token");
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <img
                    src={logo}
                    alt="CodeBifrost"
                    className="navbar-logo"
                />
                <span>CodeBifrost</span>
            </Link>
            <div className="navbar-links">
                {!isLoggedIn ? (
                    <>
                        {location.pathname !== "/login" && (
                            <Link to="/login">Login</Link>
                        )}

                        {location.pathname !== "/register" && (
                            <Link to="/register">Register</Link>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/home">Home</Link>

                        <button
                            className="navbar-logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar;
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );
            localStorage.setItem("token", response.data.token);
            await refreshUser();
            navigate("/home");
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="page">
                <div className="auth-card">
                    <h1>Welcome back</h1>
                    <p className="subtitle">Sign in to your CodeBifrost account</p>

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                className="input"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input
                                className="input"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    {message && (
                        <p className="message message-error">{message}</p>
                    )}

                    <div className="auth-footer">
                        Don't have an account?{" "}
                        <Link to="/register">Register</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
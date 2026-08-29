import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const githubToken = searchParams.get("githubToken");

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGithubRegister = () => {
        window.location.href = "http://localhost:5000/api/auth/github";
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!githubToken) {
            setMessage("GitHub authentication token missing.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/github/register",
                { githubToken, password }
            );
            localStorage.setItem("token", response.data.token);
            navigate("/home");
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="auth-card">
                <h1>Create account</h1>
                <p className="subtitle">
                    {githubToken
                        ? "GitHub verified — set a password to finish"
                        : "Connect your GitHub to get started"}
                </p>

                {!githubToken ? (
                    <>
                        <button
                            className="btn btn-github"
                            onClick={handleGithubRegister}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            Continue with GitHub
                        </button>

                        <div className="divider">or</div>

                        <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            GitHub is required to analyze repositories
                        </p>
                    </>
                ) : (
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                className="input"
                                type="password"
                                placeholder="Create a strong password"
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
                            {isLoading ? "Creating account..." : "Create account"}
                        </button>
                    </form>
                )}

                {message && (
                    <p className="message message-error">{message}</p>
                )}

                <div className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
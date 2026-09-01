import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Lock } from "lucide-react"
import "../Register.css";

const Register = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const githubToken = searchParams.get("githubToken");
    let email = "";
    try {
        if (githubToken) {
            const payload = jwtDecode(githubToken);
            email = payload.email || "";
        }
    } catch {

    }
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!githubToken) {
            setMessage("GitHub authentication token missing.");
            return;
        }
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/github/register",
                {
                    githubToken,
                    password
                }
            );
            localStorage.setItem(
                "token",
                response.data.token
            );
            navigate("/home");
        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="page">
            <div className="auth-card">
                <h1>Create your CodeBifrost account</h1>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label>GitHub account</label>
                        <div className="input-icon-wrapper">
                            <input
                                className="input input-locked"
                                type="email"
                                value={email}
                                readOnly
                            />
                            <Lock
                                className="input-lock-icon"
                                size={15}
                            />
                        </div>
                        <p className="input-hint">
                            This email is linked to your GitHub account.
                        </p>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            className="input"
                            type="password"
                            placeholder="Create a strong password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            className="input"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                        />
                    </div>
                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Creating account..."
                            : "Create account"}
                    </button>
                </form>
                {message && (
                    <p className="message message-error">
                        {message}
                    </p>
                )}
                <div className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
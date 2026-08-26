import { useState } from "react";
import {
    useSearchParams,
    useNavigate
} from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const githubToken = searchParams.get("githubToken");

    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    // STEP 1: Start GitHub OAuth
    const handleGithubRegister = () => {
        window.location.href =
            "http://localhost:5000/api/auth/github";
    };

    // STEP 2: Create CodeBifrost account
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!githubToken) {
            setMessage("GitHub authentication token missing.");
            return;
        }

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

            setMessage("Registration successful!");

            navigate("/home");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div>
            <h1>Register</h1>

            {!githubToken ? (
                <>
                    <p>
                        Register your CodeBifrost account using GitHub.
                    </p>

                    <button onClick={handleGithubRegister}>
                        Register with GitHub
                    </button>
                </>
            ) : (
                <>
                    <p>
                        Your GitHub account has been verified.
                    </p>

                    <form onSubmit={handleRegister}>
                        <input
                            type="password"
                            placeholder="Create password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                        />

                        <button type="submit">
                            Create Account
                        </button>
                    </form>
                </>
            )}

            <p>{message}</p>
        </div>
    );
};

export default Register;
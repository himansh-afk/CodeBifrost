import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);

            // Remove token from URL
            navigate("/home", { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <>
            <Navbar />
            <div>
                <h1>Welcome to CodeBifrost</h1>
                <p>You are logged in.</p>
            </div>
        </>
    );
};

export default Home;
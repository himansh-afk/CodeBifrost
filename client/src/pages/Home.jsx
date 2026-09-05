import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Home = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);

            // remove token from URL
            navigate("/home", { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <>
            <Sidebar />
        </>
    );
};

export default Home;
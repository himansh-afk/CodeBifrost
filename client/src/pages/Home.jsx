import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

const Home = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);
            navigate("/home", { replace: true });
        }
    }, [searchParams, navigate]);

    return (
        <>
            <Sidebar />
            <Chat />
        </>
    );
};

export default Home;
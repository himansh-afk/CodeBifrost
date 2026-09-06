import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

const Home = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [chatKey, setChatKey] = useState(0);
    const [selectedRepoUrl, setSelectedRepoUrl] = useState("");
    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            localStorage.setItem("token", token);
            navigate("/home", { replace: true });
        }
    }, [searchParams, navigate]);
    const handleNewChat = () => {
        setSelectedRepoUrl("");
        setChatKey((k) => k + 1);
    };
    const handleRepoSelect = (url) => {
        setSelectedRepoUrl(url);
        setChatKey((k) => k + 1);
    };
    return (
        <>
            <Sidebar
                onNewChat={handleNewChat}
                onRepoSelect={handleRepoSelect}
            />
            <Chat
                key={chatKey}
                initialRepoUrl={selectedRepoUrl}
            />
        </>
    );
};

export default Home;
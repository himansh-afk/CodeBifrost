import { useState } from "react";
import { ArrowUp, LoaderCircle } from "lucide-react";
import "./Chat.css";

const GithubIcon = ({ size = 18, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        aria-hidden="true"
    >
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.49.5.092.682-.217.682-.483 0-.237-.009-.866-.014-1.7-2.782.604-3.369-1.342-3.369-1.342-.455-1.157-1.11-1.465-1.11-1.465-.909-.621.069-.608.069-.608 1.004.071 1.532 1.03 1.532 1.03.893 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.337-.012 2.416-.012 2.744 0 .269.18.58.688.482A10.001 10.001 0 0 0 22 12C22 6.477 17.523 2 12 2Z" />
    </svg>
);

const Chat = () => {
    const [input, setInput] = useState("");
    const [repoUrl, setRepoUrl] = useState("");
    const [repoName, setRepoName] = useState("");
    const [isAsking, setIsAsking] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isRepositoryReady, setIsRepositoryReady] = useState(false);
    const [messages, setMessages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const value = input.trim();
        if (!value || isAnalyzing || isAsking) return;
        if (!isRepositoryReady) {
            const userMessage = { id: Date.now(), role: "user", content: value };
            setMessages([userMessage]);
            setIsAnalyzing(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    "http://localhost:5000/api/repository/analyze",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ url: value })
                    }
                );
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Repository analysis failed");
                const name = data.repo || value.split("/").filter(Boolean).pop()?.replace(".git", "");
                setRepoUrl(value);
                setRepoName(name || "Repository");
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        role: "assistant",
                        content: `${name || "Repository"} is mounted. Ask me anything about its code, architecture, or implementation.`
                    }
                ]);
                setIsRepositoryReady(true);
                setInput("");
            } catch (error) {
                console.error("Repository analysis error:", error);
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, role: "assistant", content: error.message || "Failed to analyze repository." }
                ]);
            } finally {
                setIsAnalyzing(false);
            }
            return;
        }
        const userMessage = { id: Date.now(), role: "user", content: value };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsAsking(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                "http://localhost:5000/api/repository/ask",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ question: value, url: repoUrl })
                }
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to answer question");

            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, role: "assistant", content: data.answer }
            ]);
        } catch (error) {
            console.error("Question error:", error);
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, role: "assistant", content: error.message || "Failed to get an answer." }
            ]);
        } finally {
            setIsAsking(false);
        }
    };
    const hasMessages = messages.length > 0;
    return (
        <main className="chat">
            {isRepositoryReady && (
                <div className="chat-heading">
                    <GithubIcon size={14} />
                    <span>{repoName}</span>
                </div>
            )}
            <div className="chat-content">
                {!hasMessages ? (
                    <div className="chat-welcome">
                        <h1>CodeBifrost</h1>
                        <p>
                            Connect a GitHub repository and ask questions
                            about its code, architecture, and implementation.
                        </p>
                    </div>
                ) : (
                    <div className="messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.role}`}>
                                {msg.role === "assistant" ? (
                                    <div className="message-body">
                                        <div className="message-meta">
                                            <div className="message-avatar">HMD</div>
                                            <span className="message-sender">Hermod</span>
                                        </div>
                                        <div className="message-bubble">{msg.content}</div>
                                    </div>
                                ) : (
                                    <div className="message-bubble">{msg.content}</div>
                                )}
                            </div>
                        ))}
                        {isAnalyzing && (
                            <div className="message assistant">
                                <div className="message-body">
                                    <div className="message-meta">
                                        <div className="message-avatar">HMD</div>
                                        <span className="message-sender">Hermod</span>
                                    </div>
                                    <div className="message-bubble">Analyzing repository...</div>
                                </div>
                            </div>
                        )}
                        {isAsking && (
                            <div className="message assistant">
                                <div className="message-body">
                                    <div className="message-meta">
                                        <div className="message-avatar">HMD</div>
                                        <span className="message-sender">Hermod</span>
                                    </div>
                                    <div className="message-bubble">Thinking...</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className={`chat-input-container ${hasMessages ? "chat-input-bottom" : "chat-input-center"}`}>
                <form className="chat-input-form" onSubmit={handleSubmit}>
                    {!isRepositoryReady && (
                        <GithubIcon className="input-icon" size={18} />
                    )}
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                            isRepositoryReady
                                ? "Ask about this repository..."
                                : "Paste GitHub repository URL"
                        }
                        disabled={isAnalyzing || isAsking}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isAnalyzing || isAsking}
                    >
                        {isAnalyzing || isAsking ? (
                            <LoaderCircle className="spin" size={18} />
                        ) : (
                            <ArrowUp size={18} />
                        )}
                    </button>
                </form>
                {!hasMessages && (
                    <p className="input-hint">
                        CodeBifrost will analyze the repository before you can ask questions.
                    </p>
                )}
            </div>
        </main>
    );
};

export default Chat;
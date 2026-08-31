import { Link } from "react-router-dom";
import "../Landing.css";

const features = [
    {
        title: "Index any repository",
        desc: "Paste a GitHub URL. Hermod reads and indexes the entire codebase — every file, every function."
    },
    {
        title: "Ask in plain language",
        desc: "No grep, no digging. Ask what a module does, how data flows, or where a bug might live."
    },
    {
        title: "Stays in context",
        desc: "Every answer is grounded in the actual code, not a generic guess."
    }
];

const steps = [
    { n: "1", text: "Connect your GitHub account" },
    { n: "2", text: "Paste a repository URL" },
    { n: "3", text: "Ask Hermod anything about it" }
];

const Landing = () => {
    return (
        <div className="landing">

            {/* ── Navbar ── */}
            <nav className="land-nav">
                <span className="land-brand">CodeBifrost</span>
                <div className="land-nav-links">
                    <Link className="land-link" to="/login">Login</Link>
                    <Link className="land-link" to="/register">Register</Link>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="land-hero">
                <p className="land-eyebrow">Powered by Hermod · Built for developers</p>
                <h1 className="land-headline">
                    Understand any codebase,<br />without reading all of it
                </h1>
                <p className="land-sub">
                    CodeBifrost analyzes GitHub repositories and lets you ask questions
                    about the code in plain language. Instant answers, full context.
                </p>
            </section>

            {/* ── Features ── */}
            <section className="land-features">
                {features.map((f) => (
                    <div className="land-card" key={f.title}>
                        <h3 className="land-card-title">{f.title}</h3>
                        <p className="land-card-desc">{f.desc}</p>
                    </div>
                ))}
            </section>

            {/* ── How it works ── */}
            <section className="land-how">
                <h2 className="land-section-title">How it works</h2>
                <div className="land-steps">
                    {steps.map((s) => (
                        <div className="land-step" key={s.n}>
                            <span className="land-step-n">{s.n}</span>
                            <p className="land-step-text">{s.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="land-footer">
                <span>CodeBifrost</span>
                <span className="land-footer-sub">Across the bridge to any codebase</span>
            </footer>

        </div>
    );
};

export default Landing;
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import GithubAuth from "./pages/GithubAuth.jsx";
import Landing from "./pages/Landing";
import Register from "./pages/Register.jsx";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-4" />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<GithubAuth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register/complete" element={<Register />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
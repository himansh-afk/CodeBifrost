import { useState } from "react";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [message, setMessage] = useState("");

  const testBackend = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/test"
      );

      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Backend Connection Failed");
    }
  };

  return (
    <div>
      <h1>CodeBifrost</h1>

      <button onClick={testBackend}>
        Test Backend
      </button>

      <p>{message}</p>

      <Link to="/login">
        Login
      </Link>

      <br />

      <Link to="/register">
        Register
      </Link>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
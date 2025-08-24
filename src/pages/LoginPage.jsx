import React, { useState } from "react";
import "./AuthPages.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post("http://localhost:8080/api/auth/login", {
            username,
            password,
        });

        const user = response.data;

        console.log("Gelen kullanici:", user);
        console.log("Gelen role:", user.role);

        localStorage.setItem("username", user.username);

        const role = user.role?.toString().trim().toUpperCase();

        if (role === "ADMIN") {
            navigate("/admin");
        } else if (role === "MEMBER") {
            navigate("/member");
        } else {
            alert("Unknown role: " + role);
        }
    } catch (error) {
        console.error("Login failed:", error);
        alert("Invalid credentials or server error.");
    }
};


  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <label>Username</label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Submit</button>

        <p className="bottom-text">
          Not have an account?{" "}
          <a href="/signup" style={{ color: "teal" }}>Sign Up Here</a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

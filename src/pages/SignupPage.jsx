import React, { useState, useEffect } from "react";
import "./AuthPages.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("MEMBER");

  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      const domain = role === "ADMIN" ? "sclubadmin.com" : "sclubmember.com";
      setEmail(`${username}@${domain}`);
    } else {
      setEmail("");
    }
  }, [username, role]);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", {
        username,
        password,
        email,
        role: role.toUpperCase(),
      });

      if (response.status === 200 || response.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Something went wrong during registration.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>Sign Up</h2>

        <label>Username</label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Email</label>
        <input type="email" value={email} disabled />

        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit">Submit</button>

        <p className="bottom-text">
          Already have an account?{" "}
          <a href="/login" style={{ color: "teal" }}>Login here</a>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./auth.css";
async function tryRegister(username, password){
    try {
        const response = (await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/v1/users",{ username, password }));
        return response.status;
      } catch (error) {
        if (error.response) {
          return error.response.status;
        }
        console.log("Failed to register:", error);
        return 500;
      }
}
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Both fields are required!");
      return;
    }
    tryRegister(username, password).then((result) => {
      if(result === 409){
        setError("User already exists");
        return;
      }
      if(result === 400){
        setError("Missing username or password");
        return;
      }
      if(result === 500){
        setError("Server error. Please try again later.");
        return;
      }
      localStorage.setItem("username",username);
      window.dispatchEvent(new Event("storage"));
      confirm("Register successful!");
      navigate("/");
    });
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
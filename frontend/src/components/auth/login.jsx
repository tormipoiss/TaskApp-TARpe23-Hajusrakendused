import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./auth.css";
async function tryLogin(username, password){
    try {
        const response = (await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/v1/users/login",{ username, password }));
        return response.status;
      } catch (error) {
        if (error.response) {
          return error.response.status;
        }
        console.log("Failed to fetch tasks:", error);
        return 500;
      }
}
function Login() {
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
    tryLogin(username, password).then((result) => {
      if(result === 400){
        setError("Missing username or password");
        return;
      }
      if(result === 404){
        setError("User not found");
        return;
      }
      if(result === 401){
        setError("Invalid credentials");
        return;
      }
      if(result === 500){
        setError("Server error. Please try again later.");
        return;
      }
      localStorage.setItem("username",username);
      window.dispatchEvent(new Event("storage"));
      confirm("Login successful!");
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
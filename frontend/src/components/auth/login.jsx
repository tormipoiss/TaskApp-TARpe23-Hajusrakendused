import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./auth.css";
async function tryLogin(username, password){
    try {
        const response = (await axios.post("/api/v1/users/login",{ username, password }));
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
      setError("Täida mõlemad väljad!");
      return;
    }
    tryLogin(username, password).then((result) => {
      if(result === 400){
        setError("Kasuja või parool puudub");
        return;
      }
      if(result === 404){
        setError("Kasutajat ei leitud");
        return;
      }
      if(result === 401){
        setError("Valesti kasutajanimi või parool");
        return;
      }
      if(result === 500){
        setError("Serveri viga. Proovi hiljem uuesti.");
        return;
      }
      localStorage.setItem("username",username);
      window.dispatchEvent(new Event("storage"));
      confirm("Sisselogimine õnnestus!");
      navigate("/");
    });
  };

  return (
    <div className="container">
      <h2>Logi sisse</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Kasutajanimi"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Parool"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Logi sisse</button>
      </form>
    </div>
  );
}

export default Login;
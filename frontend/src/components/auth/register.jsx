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
      setError("Täida mõlemad väljad!");
      return;
    }
    tryRegister(username, password).then((result) => {
      if(result === 409){
        setError("Kasutajanimi on juba võetud");
        return;
      }
      if(result === 400){
        setError("Kasuja või parool puudub");
        return;
      }
      if(result === 500){
        setError("Serveri viga. Proovi hiljem uuesti.");
        return;
      }
      localStorage.setItem("username",username);
      window.dispatchEvent(new Event("storage"));
      confirm("Registreerimine õnnestus!");
      navigate("/");
    });
  };

  return (
    <div className="container">
      <h2>Registeeri</h2>
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
        <button type="submit">Registeeri</button>
      </form>
    </div>
  );
}

export default Register;
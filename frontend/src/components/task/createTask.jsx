import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./taskForm.css";
async function tryCreateTask(username, title, description, deadline){
    try {
        const response = (await axios.post("/api/v1/tasks",{ username, title, description, deadline }));
        return response;
    } catch (error) {
    if (error.response?.data?.error) {
        return { status: error.response.status, error: error.response.data.error };
    }
    console.log("Failed to create task:", error);
    return { status: 500, error: "Server error. Please try again later." };
    }
}
function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      setError("Sa ei saa luua ülesannet, sest pole sisse logitud!");
      return;
    }
    if (!title || !description) {
      setError("Tiitel või kirjeldus on puudu!");
      return;
    }
    tryCreateTask(storedUsername, title, description, deadline).then((result) => {
      if (result.error) {
        if (result.error == "Missing required fields: title / description / username") {
            setError("Tiitel või kirjeldus on puudu");
            return;
        }
        else {
            setError("Kuupäeva väli on valesti vormistatud");
            return;
        }
      }
      else {
        // window.dispatchEvent(new Event("storage"));
        confirm("Ülesanne edukalt loodud!");
        navigate("/");
      }
    });
  };

  return (
    <div className="container">
      <h2>Loo ülesanne</h2>
      <form onSubmit={handleSubmit}>
        <span>Tiitel: </span>
        <input
          type="text"
          placeholder="Tiitel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <span>Kirjeldus: </span>
        <input
          type="text"
          placeholder="Kirjeldus"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <span>Tähtaeg (Valikuline): </span>
        <input
          type="datetime-local"
          placeholder="Tähtaeg"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Loo ülesanne</button>
      </form>
    </div>
  );
}

export default CreateTask;
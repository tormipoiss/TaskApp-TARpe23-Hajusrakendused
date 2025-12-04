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
  const [modal, setModal] = useState({
    show: false,
    message: "",
  });
  const closeModal = () => {
    setModal({ 
      show: false, 
      message: ""
    });
    navigate('/');
  };

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
        //confirm("Ülesanne edukalt loodud!");
        setModal({
          show: true,
          message: "Ülesanne edukalt loodud!"
        });
        
      }
    });
  };

  return (
    <div className="container">
      <h2>Loo ülesanne</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <label for="title">Tiitel: </label>
        <input
          className="input-field-small-small"
          id="title"
          type="text"
          placeholder="Tiitel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <label for="description">Kirjeldus: </label>
        <input
          id="description"
          className="input-field-small-small"
          type="text"
          placeholder="Kirjeldus"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <label for="deadline">Tähtaeg (Valikuline): </label>
        <input
          id="deadline"
          className="input-field-small-small"
          type="datetime-local"
          placeholder="Tähtaeg"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="update-new-btn">Loo ülesanne</button>
      </form>
      {modal.show && (
        <>
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title modal-success">Ok</h3>
            <p className="modal-success">
              {modal.message}
            </p>
            <button className="modal-close-btn" onClick={closeModal}>
              Sulge
            </button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

export default CreateTask;
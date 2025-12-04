import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./taskForm.css";
async function tryUpdateTask(id, username, title, description, deadline){
    try {
        const response = (await axios.put(import.meta.env.VITE_BACKEND_URL + `/api/v1/tasks/${id}`,{ username, title, description, deadline }));
        return response;
    } catch (error) {
    if (error.response?.data?.error) {
        return { status: error.response.status, error: error.response.data.error };
    }
    console.log("Failed to create task:", error);
    return { status: 500, error: "Server error. Please try again later." };
    }
}
function UpdateTask() {
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

  useEffect(() => {
    const storedTitle = localStorage.getItem('taskToUpdateTitle');
    const storedDescription = localStorage.getItem('taskToUpdateDescription');
    const storedDeadline = localStorage.getItem('taskToUpdateDeadline');
    
    if (storedTitle) setTitle(storedTitle);
    if (storedDescription) setDescription(storedDescription);
    if (storedDeadline) {
      console.log("Stored deadline:", storedDeadline);
      const date = new Date(storedDeadline.endsWith('Z') ? storedDeadline : storedDeadline + 'Z');
      setDeadline(toInputDateTime(date));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const storedUsername = localStorage.getItem('username');
    const storedTaskToUpdate = localStorage.getItem('taskToUpdate');
    if (!storedUsername) {
      setError("Sa ei saa luua ülesannet, sest pole sisse logitud!");
      return;
    }
    if (!storedTaskToUpdate) {
      setError("Sa ei vajutanud ülesande uuendamise nuppu siia lehel tulles!");
      return;
    }
    if (!title || !description) {
      setError("Tiitel või kirjeldus on puudu!");
      return;
    }
    tryUpdateTask(storedTaskToUpdate, storedUsername, title, description, deadline).then((result) => {
      if (result.error) {
        if (result.error == "Missing required fields: title / description / username") {
            setError("Tiitel või kirjeldus on puudu");
            return;
        }
        else {
            setError("Ülesanne mida uuendada ei leitud");
            return;
        }
      }
      else {
        // window.dispatchEvent(new Event("storage"));
        //confirm("Ülesanne edukalt uuendatud!");
        //navigate("/");
        setModal({
          show: true,
          message: "Ülesanne edukalt uuendatud!"
        });
      }
    });
  };

  return (
    <div className="container">
      <h2>Uuenda ülesanne</h2>
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
        <button type="submit">Uuenda ülesanne</button>
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

function toInputDateTime(date) {
  // Pad single-digit numbers with a leading zero
  const pad = (number) => (number < 10 ? `0${number}` : number);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth() is zero-based
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default UpdateTask;
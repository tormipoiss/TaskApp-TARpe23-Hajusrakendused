import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./taskForm.css";

async function tryShareTask(taskOwner, taskId, sharedWith) {
    try {
        const response = (await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/v1/shares",{ taskOwner, taskId, sharedWith }));
        return response;
    } catch (error) {
    if (error.response?.data?.error) {
        return { status: error.response.status, error: error.response.data.error };
    }
    console.log("Failed to share task:", error);
    return { status: 500, error: "Server error. Please try again later." };
    }
}

async function tryDeleteShare(taskId, sharedWith) {
    try {
        const response = await axios.delete(
            import.meta.env.VITE_BACKEND_URL + `/api/v1/shares/${taskId}`,
            { 
                data: { sharedWith: sharedWith } // <--- Wrap it in 'data'
            }
        );
        return response;
    } catch (error) {
    if (error.response?.data?.error) {
        return { status: error.response.status, error: error.response.data.error };
    }
    console.log("Failed to delete share:", error);
    return { status: 500, error: "Server error. Please try again later." };
    }
}

async function tryGetUsers() {
    try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/v1/users");
        const userStrings = response.data.map(user => user.username);
        return userStrings;
    } catch (error) {
        if (error.response?.data?.error) {
            return { status: error.response.status, error: error.response.data.error };
        }
        console.log("Failed to get users:", error);
        return { status: 500, error: "Server error. Please try again later." };
    }
}

function ShareTask() {
  const [userToShareWith, setUserToShareWith] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
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
    tryGetUsers().then((result) => {
      if (result.error) {
          setError("Ühtegi kasutajat ei leitud andmebaasis");
          return;
      }
      else {
        setUsers(result)
      }
    });
  }, []);

  const handleShare = async (e) => {
    e.preventDefault();
    setError("");
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      setError("Sa ei saa jagada ülesannet, sest pole sisse logitud!");
      return;
    }
    const storedTaskOwner = localStorage.getItem('taskToShareOwner');
    if (!storedTaskOwner) {
      setError("Sa ei saa jagada ülesannet, sest pole mälus ülesande omanikku!");
      return;
    }
    const storedTaskID = localStorage.getItem('taskToShare');
    if (!storedTaskID) {
      setError("Sa ei saa jagada ülesannet, sest ei leitud ülesannet mida jagada!");
      return;
    }
    if (!userToShareWith) {
      setError("Kasutaja kellega jagada on puudu!");
      return;
    }
    
    tryShareTask(storedTaskOwner, storedTaskID, userToShareWith).then((result) => {
      if (result.error) {
        if (result.error == "Missing required fields: taskOwner / taskId / sharedWith") {
            setError("Puuduvad vajalikud väljad: Sinu kasutajanimi, Ülesanne ID või kasutaja kellega jagada nimi");
            return;
        }
        else if (result.error == "Task not found") {
            setError("Ülesanne mida jagada ei leitud andmebaasist");
            return;
        }
        else if (result.error == "Task owner not found") {
            setError("Sinu kasutajanimi ei leitud andmebaasist");
            return;
        }
        else if (result.error == "User who this was shared to not found") {
            setError("Kasutaja, kellega ülesannet jagad ei leitud andmebaasist");
            return;
        } 
        else if (result.error == "User to share with cant be same as the user who wants to share") {
            setError("Kasutaja, kellega ülesannet jagada ei tohi olla ülesande omanik");
            return;
        }
        else if (result.error == "Task already shared with this user") {
            setError("Selle kasutajaga on ülesanne juba jagatud");
            return;
        }
        else {
            console.log("Serveri error:", error)
            setError("Tundmatu serveri error");
            return;
        }
      }
      else {
        setModal({
          show: true,
          message: `Ülesanne edukalt jagatud kasutajaga: ${userToShareWith}`
        });
      }
    });
  };

  const handleUnshare = async (e) => {
    e.preventDefault();
    setError("");
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      setError("Sa ei saa eemaldada jagamist, sest pole sisse logitud!");
      return;
    }
    const storedTaskID = localStorage.getItem('taskToShare');
    if (!storedTaskID) {
      setError("Sa ei saa eemaldada jagamist, sest ei leitud ülesannet millest jagamist eemaldada!");
      return;
    }
    if (!userToShareWith) {
      setError("Kasutaja kellelt jagamist eemaldada on puudu!");
      return;
    }
    tryDeleteShare(storedTaskID, userToShareWith).then((result) => {
      if (result.error) {
        if (result.error == "URL does not contain task ID") {
            setError("Puudub ülesande ID");
            return;
        }
        else if (result.error == "Missing required fields: sharedWith") {
            setError("Puudub kasutaja, kellelt jagamist eemaldada");
            return;
        }
        else if (result.error == "User who this was shared to not found") {
            setError("Ei leitud andmebaasist kasutajat, kellelt tahad jagamist eemaldada");
            return;
        }
        else if (result.error == "Share not found") {
            setError("Ei leitud andmebaasist jagamist sellele kasutajale sellel ülesandel");
            return;
        } 
        else {
            console.log("Serveri error:", error)
            setError("Tundmatu serveri error");
            return;
        }
      }
      else {
        setModal({
          show: true,
          message: `Ülesande jagamine edukalt eemaldatud kasutajalt: ${userToShareWith}`
        });
      }
    });
  };

  return (
    <div className="container">
      <h2>Jaga ülesanne</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <span>Kasutaja: </span>
        <select
          value={userToShareWith}
          onChange={(e) => setUserToShareWith(e.target.value)}
        >
          <option value="" disabled>Vali kasutaja...</option>
          {users.map((user) => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>
        <br />
        {error && <p className="error">{error}</p>}
        
        {/* Button 1: Share */}
        <button 
            type="submit" 
            onClick={handleShare} // Different handler
        >
            Jaga ülesanne
        </button>

        {/* Button 2: Remove Share */}
        <button 
            type="submit" 
            onClick={handleUnshare} // Different handler
            className="remove-btn" // Optional: Add styling to look red/dangerous
        >
            Eemalda jagamine
        </button>
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

export default ShareTask;
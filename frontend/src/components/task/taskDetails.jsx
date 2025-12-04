import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./taskForm.css";

function TaskDetails() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadlineText, setDeadlineText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedTitle = localStorage.getItem('taskTitle');
    const storedDescription = localStorage.getItem('taskDescription');
    const storedDeadline = localStorage.getItem('taskDeadline');
    
    if (storedTitle) setTitle(storedTitle);
    if (storedDescription) setDescription(storedDescription);
    if (storedDeadline) {
      const date = new Date(storedDeadline);
      setDeadlineText(date.toLocaleString());
    } else {
      setDeadlineText("Pole");
    }
  }, []);

  return (
    <div className="container">
      <h2>Ülesande kirjeldus</h2>
        <span>Tiitel: </span>
        <span>{title}</span>
        <br />
        <span>Kirjeldus: </span>
        <span>{description}</span>
        <br />
        <span>Tähtaeg: </span>
        <span>{deadlineText}</span>
        <button className="button" onClick={() => navigate("*", { replace: true })}>
          Tagasi
        </button>
    </div>
  );
}

export default TaskDetails;
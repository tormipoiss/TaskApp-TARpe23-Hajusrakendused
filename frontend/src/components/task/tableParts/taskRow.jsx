import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";

export default function TaskRow({task}) {
  const navigate = useNavigate();
  const [styleDeadline, setStyleDeadline] = useState(null);

  const fetchTaskDescription = async () => {
    try { 
      const response = await axios.get(`/api/v1/tasks/${task.id}`);
      return response.data.description;
    } catch (error) {
      console.log("Failed to fetch task:", error);
      return null; // Return fallback
    }
  };

  const handleUpdate = async () => {
    const taskDescription = await fetchTaskDescription();
    let taskDeadlineSliced = null;
    if (task.deadline != null) {
      const taskDeadlineString = task.deadline.toString()
      taskDeadlineSliced = taskDeadlineString.slice(0, 16);
    }
    localStorage.setItem("taskToUpdate", task.id);
    localStorage.setItem("taskToUpdateTitle", task.title);
    localStorage.setItem("taskToUpdateDescription", taskDescription || '');
    localStorage.setItem("taskToUpdateDeadline", taskDeadlineSliced || '');
    navigate("/updateTask", { replace: true });
  };

  const handleDetails = async () => {
    const taskDescription = await fetchTaskDescription();
    localStorage.setItem("taskTitle", task.title);
    localStorage.setItem("taskDescription", taskDescription || '');
    localStorage.setItem("taskDeadline", task.deadline || '');
    navigate("/details", { replace: true });
    };
  const handleDelete = async () => {
    localStorage.setItem("taskToDelete", task.id);
    
    window.dispatchEvent(new CustomEvent('deleteTask', { detail: { id: task.id } }));
  };

  const handleShare = async () => {
    localStorage.setItem("taskToShare", task.id);
    navigate("/share", { replace: true });
  };
    useEffect(() => {
      if(styleDeadline === null){
          if(task.deadline == null){
            setStyleDeadline("Pole");
            return;
          }
          const date = new Date(task.deadline);
          setStyleDeadline(date.toLocaleString());
      }
    }, []);

  return (
    <tr>
      <td>{task.title}</td>
      <td>{styleDeadline}</td>
      <td>
        <button className="view-btn" onClick={handleDetails}>
          Vaata
        </button>
        <button className="update-btn" onClick={handleUpdate}>
          Uuenda
        </button>
        <button className="delete-btn" onClick={handleDelete}>
          Kustuta
        </button>
        <button className="share-btn" onClick={handleShare}>
          Jaga
        </button>
      </td>
    </tr>
  );
}
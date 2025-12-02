import { useNavigate } from 'react-router-dom';
import axios from "axios";

export default function TaskRow({task}) {
  const navigate = useNavigate();

  const fetchTaskDescription = async () => {
    try { 
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + `/api/v1/tasks/${task.id}`);
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

  return (
    <tr>
      <td>{task.title}</td>
      <td>
        <button className="view-btn" onClick={() => alert(`View ${task.title}`)}>
          Vaata
        </button>
        <button className="update-btn" onClick={handleUpdate}>  {/* Use named handler */}
          Uuenda
        </button>
        <button className="delete-btn" onClick={() => alert(`Delete ${task.title}`)}>
          Kustuta
        </button>
        <button className="share-btn" onClick={() => alert(`Share ${task.title}`)}>
          Jaga
        </button>
      </td>
    </tr>
  );
}
import TaskRow from "./tableParts/taskRow.jsx"
import {useEffect, useState} from "react";
import axios from "axios";
import {
  useNavigate,
} from 'react-router-dom';

export default function TasksTable() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filteredTasksSorted, setFilteredTasksSorted] = useState([]);
  const navigate = useNavigate();
  const [modal, setModal] = useState({
        show: false,
        message: "",
        isSuccess: false,
      });
  const closeModal = () => {
        setModal({ 
          show: false, 
          message: ""
        });
        navigate('/');
      };

  useEffect(() => {
    const fetchTasks = async () => {
      try { 
        const response = (await axios.get(import.meta.env.VITE_BACKEND_URL + `/api/v1/tasks/getbyuser/${localStorage.getItem('username')}`));
        setTasks(response.data);
      } catch (error) {
        console.log("Failed to fetch tasks:", error);
      }
    }
    fetchTasks();
  }, []);

  // ✅ Filter + Sort in useEffect, not component body
  useEffect(() => {
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const sorted = filtered.sort((a, b) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
    });
    
    setFilteredTasksSorted(sorted);
  }, [tasks, searchTerm]);  // Re-run when tasks or search change

  const deleteTask = async () => {
    try { 
      const response = await axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/v1/tasks/${selectedTaskId}`);
      return response.data.description;
    } catch (error) {
      console.log("Failed to fetch task:", error);
      return null; // Return fallback
    }
  };

  const confirmDeleteTask = async () => {
    await deleteTask();
    localStorage.removeItem('taskToDelete');
    setFilteredTasksSorted(prev => prev.filter(task => task.id != selectedTaskId));
    setModal({
          show: true,
          message: "Ülesanne edukalt kustutatud!",
          isSuccess: true,
        });
  }
  const handleDeleteTask = (taskId) => {
    setModal({
          show: true,
          message: "Kas soovid seda ülesannet kustutada?",
          isSuccess: false,
        });
    setSelectedTaskId(taskId);
  };

  // ✅ Move event listener to useEffect with cleanup
  useEffect(() => {
    const handler = (e) => handleDeleteTask(e.detail.id);
    window.addEventListener('deleteTask', handler);
    return () => window.removeEventListener('deleteTask', handler);
  }, []);

  return (
    <>
      <style>{`
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          font-family: Arial, sans-serif;
        }
        thead {
          background-color: #4CAF50;
          color: white;
        }
        th, td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          text-align: left;
        }
        button {
          margin: 0 2px;
          padding: 5px 10px;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.9em;
          color: white;
        }
        .create-btn {
          background-color: #2196F3;
          color: #FFFFFF;
          padding: 4px;
          border-radius:3px;
        }
        .view-btn {
          background-color: #009688;
        }
        .update-btn {
          background-color: #FFC107;
          color: black;
        }
        .delete-btn {
          background-color: #F44336;
        }
        .share-btn {
          background-color: #673AB7;
        }
      `}</style>

      <div>
        <input
          style={{ fontSize: '16px', marginRight: '10px' }}
          type="text"
          placeholder="Otsi ülesandeid..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <button className="create-btn" onClick={() => navigate("/createTask", { replace: true })}>
          Loo ülesanne
        </button>
      </div>

      {filteredTasksSorted.length < 1 ? (
        searchTerm.length < 1
          ? "Teil pole ühtegi ülesannet, võite luua uue ülesande"
          : "Teie otsingule ei vastanud ühtegi ülesannet"
      ) : null}

      <table>
        <thead>
          <tr>
            <th>Ülesanne</th>
            <th>Tähtaeg</th>
            <th>Juhtnupud</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasksSorted.map(task => (
            <TaskRow key={task.id} task={task} />
          ))}
        </tbody>
      </table>
      {modal.show && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      
      {modal.isSuccess ? (
        <>
          <h3 className="modal-title modal-success">Ok</h3>
          <p className="modal-success">{modal.message}</p>
          <button className="modal-btn modal-close-btn" onClick={closeModal}>
            Sulge
          </button>
        </>
      ) : (
        <>
          <h3 className="modal-title">Kustuta ülesanne ära?</h3>
          <p className="modal-title">{modal.message}</p>
          <div className="confirm-buttons">
            <button className="modal-btn cancel-btn" onClick={closeModal}>
              Tühista
            </button>
            <button className="modal-btn confirm-delete-btn" onClick={confirmDeleteTask}>
              Jah, kustuta ära
            </button>
          </div>
        </>
      )}
      
    </div>
  </div>
)}
    </>
  );
}
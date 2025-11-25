import TaskRow from "./tableParts/taskRow.jsx"
import {useEffect, useState} from "react";
import axios from "axios";

export default function TasksTable() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [noTasksContent, setNoTasksContent] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = (await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/v1/tasks"));
        const fetchedTasks = response.data
        setTasks(fetchedTasks);

//         setTasks([
//           {
//     "id": 3,
//     "username": "some text",
//     "title": "CAB",
//     "description": "some text"
// },
//           {
//     "id": 1,
//     "username": "some text",
//     "title": "ACB",
//     "description": "some text",
//     "deadline": "2018-02-10T09:30Z"
// },
//           {
//     "id": 2,
//     "username": "some text",
//     "title": "BCA",
//     "description": "some text",
//     "deadline": "2026-02-10T09:30Z"
// }
        // ])
      } catch (error) {
        console.log("Failed to fetch tasks:", error);
      }
    }
    fetchTasks().then(() => console.log("Success fetching tasks"));
  }, []);

  useEffect(() => {
    // Filter tasks by search term (case insensitive)
    const filteredTasks = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort filtered tasks by deadline:
  // - Tasks with deadline sorted ascending by date
  // - Tasks with no deadline pushed to bottom
  filteredTasks.sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0; // both no deadline
    if (!a.deadline) return 1; // a no deadline, b with deadline -> a after b
    if (!b.deadline) return -1; // b no deadline, a with deadline -> b after a
    return new Date(a.deadline) - new Date(b.deadline); // oldest first
  });
  
    const newRows = filteredTasks.map(task => (
    <TaskRow key={task.id} task={task} />
  ));

  setRows(newRows);

  if (filteredTasks.length < 1) {
    setNoTasksContent(
      searchTerm.length < 1
        ? "Teil pole ühtegi ülesannet, võite luua uue ülesande"
        : "Teie otsingule ei vastanud ühtegi ülesannet"
    );
  } else {
    setNoTasksContent("");
  }
  }, [tasks, searchTerm]);

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

        <button className="create-btn" onClick={() => alert('Create clicked')}>
          Loo ülesanne
        </button>
      </div>

      {noTasksContent}

      <table>
        <thead>
          <tr>
            <th>Ülesanne</th>
            <th>Juhtnupud</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
}
import TaskRow from "./tableParts/taskRow.jsx"
import {useEffect, useState} from "react";
import axios from "axios";

export default function TasksTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let tasks = [];
    const categorizeTasks = () => {
      const rows = [];
      tasks.forEach((task) => {
        rows.push(
          <TaskRow
            task={task}
            key={task.id} />
        );
      });
      setRows(rows);
    }
    const fetchTasks = async () => {
      try {
        const response = (await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/v1/tasks"));
        tasks = response.data;
        categorizeTasks();
      } catch (error) {
        console.log("Failed to fetch tasks:", error);
      }
    }
    fetchTasks().then(() => console.log("Success fetching tasks"));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Ülesanne</th>
          <th>Juhtnupud</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
import TaskRow from "./tableParts/taskRow.jsx"

export default function TasksTable({ tasks }) {
  const rows = [];
//   let lastDeadline = null;

  tasks.forEach((task) => {
    // if (task.deadline !== lastDeadline) {
    //     rows.push(
    //         <TaskRow
    //             task={task} />
    //     );
    // }
    rows.push(
        <TaskRow
            task={task} />
    );
    // lastDeadline = task.deadline
  });

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
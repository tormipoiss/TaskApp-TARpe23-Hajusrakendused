export default function TaskRow({task}) {
    return (
        <tr>
            <td>{task.title}</td>
            <td>
                <button className="view-btn" onClick={() => alert(`View ${task.title}`)}>
                Vaata
                </button>
                <button className="update-btn" onClick={() => alert(`Update ${task.title}`)}>
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
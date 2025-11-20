import TasksTable from "./tasksTable";

export default function FilterableTasksTable() {
    return (
        <div>
            <form>
                <input 
                    type="text" 
                    placeholder="Search..."/>
                <label>
                    <input 
                    type="checkbox" />
                    {' '}
                    Only show products in stock
                </label>
            </form>
            <TasksTable />
        </div>
    );
}
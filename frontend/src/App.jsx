import './App.css';
import FilterableTasksTable from './components/task/filterableTasksTable';
import Login from './components/auth/login.jsx';
import Register from './components/auth/register.jsx';
import CreateTask from './components/task/createTask.jsx';
import UpdateTask from './components/task/updateTask.jsx';
import Profile from './components/profile/profileModal.jsx';
import TaskDetails from './components/task/taskDetails.jsx';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { useState, useEffect } from 'react';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("username");
    // re-render
    window.dispatchEvent(new Event("storage"));
    alert("Väljalogimine õnnestus!");
    navigate("/login", { replace: true });
  }, [navigate]);

  return <div>Logging out...</div>;
}

function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('username');
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    const handler = () => forceUpdate((i) => i + 1);

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  }, []);

  const username = localStorage.getItem('username');

  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: '#f4f4f4', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" style={{ fontWeight: 'bold' }}>Kodu</Link>
        </div>

        <div>
          {username ? (
            <>
              <span style={{ marginRight: '1rem', color: "black" }}>
                Tere, <strong>{username}</strong>
              </span>
              <Link to="/profile" style={{ color: '#003cffff', marginRight:'0.5rem' }}>Profile</Link>
              <Link to="/logout" style={{ color: '#d32f2f' }}>Logi välja</Link>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: '1rem' }}>Logi sisse</Link>
              <Link to="/register">Registeeri</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <FilterableTasksTable />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/createTask" element={<CreateTask />} />
        <Route path="/updateTask" element={<UpdateTask />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/details" element={<TaskDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
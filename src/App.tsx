import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Board from "./pages/Board";
import Navbar from "./components/Navbar";
import { useAuth } from "./contexts/AuthContext";
import Register from "./pages/Register";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar /> {/* 導覽列 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/board"
          element={user ? <Board /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/board" element={<Board />} />
        <Route path="/auth" element={<Login />} />


      </Routes>
    </Router>
  );
}

export default App;


import './App.css';
import React from 'react';
import DashBoard from './pages/Dashboard';
import Board from './Component/Board';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Lobby from "./Component/Lobby";
import EntryPage from "./pages/EntryPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from './context/AuthContext';
import HowToPlay from './pages/how-to-play';
import Home from './pages/Home';

// ← Add this component
function ProtectedRoute({ children }) {
    const { user, authLoading } = useAuth();
    const location = useLocation();

    if (authLoading) return null; // wait for auth check to finish

    if (!user) {
        // Save the page they were trying to visit
        return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
    }

    return children;
}

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/how-to-play" element={<HowToPlay />} />
                <Route path="/entry" element={<EntryPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><DashBoard /></ProtectedRoute>} />
                <Route path="/lobby" element={<ProtectedRoute><Lobby /></ProtectedRoute>} />
                <Route path="/game" element={<ProtectedRoute><Board /></ProtectedRoute>} />
            </Routes>
        </>
    );
}

export default App;
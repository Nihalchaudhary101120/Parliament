import './App.css';
import React from 'react';
import DashBoard from './pages/Dashboard';
import Board from './Component/Board';
import { Routes, Route } from 'react-router-dom';
import Lobby from "./Component/Lobby";
import EntryPage from "./pages/EntryPage";
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const location = useLocation();
 
  return (
    <>
      <Routes>
        <Route path="/" index element={<EntryPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Board />} />
      </Routes>
    </>
  )
}

export default App

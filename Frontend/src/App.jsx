import './App.css';
import React from 'react';
import DashBoard from './pages/Dashboard';
import Board from './Component/Board';
import { Routes, Route } from 'react-router-dom';
import Lobby from "./Component/Lobby";
import EntryPage from "./pages/EntryPage";

function App() {

  return (
    <>
       <Routes>
          <Route path="/" index element ={<EntryPage/>} />
          <Route path="/dashboard"  element={<DashBoard />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/parliamentGame" element={<Board />} />
        </Routes>
    </>
  )
}

export default App

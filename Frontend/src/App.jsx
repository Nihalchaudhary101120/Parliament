import './App.css';
import React from 'react';
import DashBoard from './pages/Dashboard';
import Board from './Component/Board';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
       <Routes>
          <Route path="/" index element={<DashBoard />} />
          <Route path="/parliamentGame" element={<Board />} />
        </Routes>
    </>
  )
}

export default App

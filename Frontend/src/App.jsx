import './App.css';
import DashBoard from './pages/Dashboard';
import Board from './Component/Board';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
       <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/ParliamentGame" element={<Board />} />
        </Routes>
    </>
  )
}

export default App

import React from 'react'
import './Board.css'
import logo from "../assets/parliamentlogo.png";
import wallMaria from "../assets/wallMaria.png";
import wallSena from "../assets/wallSena.png";
import wallRose from "../assets/wallRose.png";
import emergency from "../assets/emergency.png";
import dice from "../assets/dice.png";

const Board = () => {
  const size = 9;
  const border = [];

  for (let i = 0; i < size; i++) border.push({ r: 0, c: i });
  for (let i = 1; i < size; i++) border.push({ r: i, c: size - 1 });
  for (let i = size - 2; i >= 0; i--) border.push({ r: size - 1, c: i });
  for (let i = size - 2; i > 0; i--) border.push({ r: i, c: 0 });

  return (
    // <div className="hero2 min-h-screen bg-gradient-to-br from-indigo-950 to-black flex justify-center items-center p-6">
    <div className="hero2 min-h-screen bg-gradient-to-br from-indigo-950 to-black flex justify-center items-center gap-8 p-6">

      <div className="bg-transparent p-6 rounded-3xl shadow-2xl">

        <div
          className="grid gap-2 bg-transparent p-4 rounded-2xl"
          style={{
            gridTemplateColumns: `repeat(${size}, 90px)`,
            gridTemplateRows: `repeat(${size}, 70px)`,

          }}
        >
          {border.map((cell, i) => {
            const isCorner =
              (cell.r === 0 && cell.c === 0) ||
              (cell.r === 0 && cell.c === size - 1) ||
              (cell.r === size - 1 && cell.c === 0) ||
              (cell.r === size - 1 && cell.c === size - 1);

            return (
              <div
                key={i}
                className={`flex items-center justify-center rounded-xl font-bold text-yellow-300 shadow-lg
                  ${isCorner ? "bg-red-600 scale-110" : "bg-red-700"}`}
                style={{
                  gridRow: cell.r + 1,
                  gridColumn: cell.c + 1
                }}
              >
                ?
              </div>
            );
          })}


          {/* Center Area */}
          <div
            className="bg-transparent center-area backdrop-blur-sm rounded-2xl"
            style={{
              gridRow: "2 / span 7",
              gridColumn: "2 / span 7"
            }}
          >
            <div className="center-grid">
              {["Nihal", "tanmay jhatu", "dhanagar ", "shlok bhatia", "gopesh ", "saurav  "].map(i => (
                <div key={i} className="player-cell">
                  <div className="image-parent">
                    <div className="absolute name top-0 left-0 bg-black/70 text-yellow-300 px-2 py-1 rounded text-sm font-bold z-10 ">
                      <span> {i}</span>
                    </div>
                    <img src={logo} className="parl" alt={`Player ${i}`} />
                    <div className="hp">HP  650 / 1000</div>
                    <div className="shield">shield 650 / 1000</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
      {/* ================= RIGHT SIDE 2x2 GRID ================= */}
      <div className='right-container'>
        <div className="right-grid">
          {[emergency, wallSena, wallMaria, wallRose].map((i) => (
            <div key={i} className="right-cell">
              <img src={i} alt={`slot-${i}`} />
            </div>
          ))}
        </div>
        <div className="dice-container">
          <img src={dice} alt="" />
        </div>
      </div>
    </div >
  );
}

export default Board
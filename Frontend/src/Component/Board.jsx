import React from 'react'
import './Board.css'
import logo from "../assets/parliamentlogo.png";
const Board = () => {
  const size = 9;
  const border = [];
  

  for (let i = 0; i < size; i++) border.push({ r: 0, c: i });
  for (let i = 1; i < size; i++) border.push({ r: i, c: size - 1 });
  for (let i = size - 2; i >= 0; i--) border.push({ r: size - 1, c: i });
  for (let i = size - 2; i > 0; i--) border.push({ r: i, c: 0 });

  return (
    <div className="hero2 min-h-screen bg-gradient-to-br from-indigo-950 to-black flex justify-center items-center p-6">
      <div className="bg-transparent p-6 rounded-3xl shadow-2xl">

        <div
          className="grid gap-2 bg-transparent p-4 rounded-2xl"
          style={{
            gridTemplateColumns: `repeat(${size}, 85px)`,
            gridTemplateRows: `repeat(${size}, 70px)`
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
            className="bg-transparent backdrop-blur-sm rounded-2xl flex items-center justify-center"
            style={{
              gridRow: "2 / span 7",
              gridColumn: "2 / span 7"

            }}
          >
            <div className="grid  grid-cols-2 gap-5">
              {[1, 2, 3, 4 , 5 , 6].map(i => (
                <div
                  key={i}
                  className="bg-transparent players  rounded-xl px-6 py-5 text-center text-yellow-200 font-bold shadow-lg"
                > 
                   {i}
                  <img src={logo} className="w-60 h-30" />
                  <div className="hp"> HP {i} 650 / 1000</div>
                   

                   <div className="shield">  shield{i} 650 / 1000</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Board

import React from 'react'
import './Board.css'
const Board = () => {
  const size = 9;
  const border = [];

  for (let i = 0; i < size; i++) border.push({ r: 0, c: i });
  for (let i = 1; i < size; i++) border.push({ r: i, c: size - 1 });
  for (let i = size - 2; i >= 0; i--) border.push({ r: size - 1, c: i });
  for (let i = size - 2; i > 0; i--) border.push({ r: i, c: 0 });

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-indigo-950 to-black flex justify-center items-center p-6">
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
            className="bg-indigo-900 rounded-2xl flex items-center justify-center"
            style={{
              gridRow: "3 / span 5",
              gridColumn: "3 / span 5"
            }}
          >
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4 , 5 , 6].map(i => (
                <div
                  key={i}
                  className="bg-orange-600 rounded-xl px-6 py-5 text-center text-yellow-200 font-bold shadow-lg"
                >
                  Base {i}
                  <div>650 / 1000</div>
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

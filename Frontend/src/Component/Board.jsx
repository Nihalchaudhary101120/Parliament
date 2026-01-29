import React from 'react'
import './Board.css'
import {useState ,useEffect ,useRef} from 'react'
import logo from "../assets/parliamentlogo.png";
import wallMaria from "../assets/wallMaria.png";
import wallSena from "../assets/wallSena.png";
import wallRose from "../assets/wallRose.png";
import emergency from "../assets/emergency.png";
import dice from "../assets/dice.png";
import diceAudio from "../assets/diceAudio.mp3";

const Board = () => {
  const size = 9;
  const border = [];
  const currentHP = 400;
  const maxHP = 1000;
  const hpPercent = (currentHP / maxHP) * 100;

   // Shield values
  const currentShield = 650;
  const maxShield = 1000;
  const shieldPercent = (currentShield / maxShield) * 100;

  const [diceValue,setDiceValue]=useState(1);
  const [isRolling,setIsRolling]=useState(false);
  const audioRef = useRef(null);
   useEffect(() => {
    audioRef.current = new Audio(diceAudio);
    audioRef.current.volume = 1.0; // Adjust volume (0.0 to 1.0)
  }, []);


  for (let i = 0; i < size; i++) border.push({ r: 0, c: i });
  for (let i = 1; i < size; i++) border.push({ r: i, c: size - 1 });
  for (let i = size - 2; i >= 0; i--) border.push({ r: size - 1, c: i });
  for (let i = size - 2; i > 0; i--) border.push({ r: i, c: 0 });


  // function to roll the die

  const rollDice = ()=>{
        if(isRolling) return;
        setIsRolling(true);


if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }
        
        let rollCount =0 ;
        const rollInterval = setInterval(()=>{
           setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount >= 15) { // Roll animation for 15 times
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);

        console.log(`Dice rolled: ${finalValue}`);
        }
        },35);  // Change dice value every 100ms
  }

  return (
    <div className="hero2 min-h-screen bg-gradient-to-br from-indigo-950 to-black p-6">
      
      {/* Board - Centered */}
      <div className="board-wrapper">
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
                {["Nihal", "tanmay jhatu", "dhanagar", "shlok bhatia", "gopesh", "saurav"].map((name, i) => (
                  <div key={i} className={`player-cell ${hpPercent <= 30 ? "low" : ""}`}>
                    <div className="image-parent">
                      <div className="name">
                        <span>{name}</span>
                      </div>
                      <img src={logo} className="parl" alt={`Player ${name}`} />
                      <div className={`hp-bar ${hpPercent <= 30 ? "low" : ""}`}>
                        <div className="hp-fill" style={{ width: `${hpPercent}%` }} />
                        <span className="hp-text">{currentHP} / {maxHP}</span>
                      </div>
                      <div className="shield-bar">
                        <div className="shield-fill" style={{ width: `${shieldPercent}%` }} />
                        <span className="shield-text">{currentShield} / {maxShield}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Container - Positioned on Right */}
      <div className='right-container'>
        <div className="right-grid">
          {[emergency, wallSena, wallMaria, wallRose].map((img, i) => (
            <div key={i} className="right-cell">
              <img src={img} alt={`slot-${i}`} />
            </div>
          ))}
        </div>
        <div className={`dice-container ${isRolling? "rolling" : ""}`}  
        onClick={rollDice}
        >

          <div className="dice-display">
            <span className="dice-number">{diceValue}</span>
          </div>
          {/* <img src={dice} alt="dice" /> */}
        </div>
      </div>
    </div>
  );
}

export default Board
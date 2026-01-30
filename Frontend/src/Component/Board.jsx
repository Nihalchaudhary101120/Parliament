import React from 'react'
import './Board.css'
import { useState, useEffect, useRef } from 'react'
import logo from "../assets/parliamentlogo.png";
import wallMaria from "../assets/wallMaria.png";
import wallSena from "../assets/wallSena.png";
import wallRose from "../assets/wallRose.png";
import emergency from "../assets/emergency.png";
import dice from "../assets/dice.png";
import ludoPieceAudio from "../assets/ludo_piece_move.mp3";
import diceAudio from "../assets/diceAudio.mp3";
import whitePawn from "../assets/whitePawn.png";
import mineIcon from "../assets/icons/mine.png";
import missileIcon from "../assets/icons/missile.png";
import radiationIcon from "../assets/icons/radiation.png";
import grenadeIcon from "../assets/icons/grenade.png";
import hammerIcon from "../assets/icons/hammer.png";
import mysteryIcon from "../assets/icons/mystery.png";
import scientistIcon from "../assets/icons/scientist.png";
import tankIcon from "../assets/icons/tank.png";
import laserIcon from "../assets/icons/lasergun.png";
import shockwaveIcon from "../assets/icons/shock.png";
import agentIcon from "../assets/icons/agent.png";
import engineerIcon from "../assets/icons/engineer.png";
import startIcon from "../assets/icons/flag.png";
import terroristIcon from "../assets/icons/terrorist.png";
import airStrikeIcon from "../assets/icons/air.png";
import nuclearAttackIcon from "../assets/icons/nuclear.png";
import canonIcon from "../assets/icons/canon.png";
import shotgunIcon from "../assets/icons/shotgun.png";
import revolverIcon from "../assets/icons/revolver.png";
import machineGunIcon from "../assets/icons/machinegun.png";
import tsunamiIcon from "../assets/icons/tsunami.png";
import timeBombIcon from "../assets/icons/time-bomb.png"; 
import torpedoIcon from "../assets/icons/torpedo.png"; 
import safeZoneIcon from "../assets/icons/safe-zone.png"; 
import brahmosIcon from "../assets/icons/brahmos.png"; 


const Board = () => {

  const tileIcons = {
    "terrorist-attack":terroristIcon,
    "air-strike":airStrikeIcon,
    "nuclear-attack":nuclearAttackIcon,
    "mine": mineIcon,
    "ballistic-missile": missileIcon,
    "dragon-cannon": canonIcon,
    "radiation-zone": radiationIcon,
    "grenade": grenadeIcon,
    "hammer": hammerIcon,
    "mystery": mysteryIcon,
    "scientist": scientistIcon,
    "tank": tankIcon,
    "laser": laserIcon,
    "shock-wave": shockwaveIcon,
    "agent": agentIcon,
    "revolver": revolverIcon,
    "engineer": engineerIcon,
    "start": startIcon,
    "double-barrel": shotgunIcon,
    "tsunami": tsunamiIcon,
    "machine-gun": machineGunIcon,
    "time-bomb": timeBombIcon,
    "torpedo": torpedoIcon,
    "brahmos": brahmosIcon,
    "safe-zone": safeZoneIcon,
  };



  const tileData = [
    "Start",
    "Mine",
    "Mystery",
    "Radiation Zone",
    "Scientist",
    "Dragon Cannon",
    "Engineer",
    "Ballistic Missile",
    "Terrorist Attack",

    "Agent",
    "Tsunami",
    "Mystery",
    "Revolver",
    "Engineer",
    "Time Bomb",
    "Air Strike",
    "Safe Zone",

    "Hammer",
    "Double Barrel",
    "Mystery",
    "Scientist",
    "Torpedo",
    "Brahmos",
    "Laser",
    "Shock Wave",

    "Nuclear Attack",
    "Grenade",
    "Engineer",
    "Mystery",
    "Machine Gun",
    "Tank",
    "Agent"
  ];



  const [players, setPlayers] = useState([
    { id: 1, name: "Nihal", pos: 0, pawn: whitePawn },
    { id: 2, name: "Tanmay", pos: 0, pawn: whitePawn },
    { id: 3, name: "Dhanagar", pos: 0, pawn: whitePawn },
    { id: 4, name: "Shlok", pos: 0, pawn: whitePawn },
    { id: 5, name: "Gopesh", pos: 0, pawn: whitePawn },
    { id: 6, name: "Saurav", pos: 0, pawn: whitePawn },
  ]);
  const [currentTurn, setCurrentTurn] = useState(0);

  const size = 9;
  const currentHP = 400;
  const maxHP = 1000;
  const hpPercent = (currentHP / maxHP) * 100;

  // Shield values
  const currentShield = 650;
  const maxShield = 1000;
  const shieldPercent = (currentShield / maxShield) * 100;

  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const audioRef = useRef(null);
  useEffect(() => {
    audioRef.current = new Audio(diceAudio);
    audioRef.current.volume = 1.0; // Adjust volume (0.0 to 1.0)
  }, []);

  const tileLayouts = {
    1: [{ x: 0, y: 0, scale: 1 }],
    2: [
      { x: -18, y: 0, scale: 0.85 },
      { x: 18, y: 0, scale: 0.85 },
    ],
    3: [
      { x: 0, y: -18, scale: 0.8 },
      { x: -18, y: 18, scale: 0.8 },
      { x: 18, y: 18, scale: 0.8 },
    ],
    4: [
      { x: -18, y: -18, scale: 0.75 },
      { x: 18, y: -18, scale: 0.75 },
      { x: -18, y: 18, scale: 0.75 },
      { x: 18, y: 18, scale: 0.75 },
    ],
    5: [
      { x: 0, y: -22, scale: 0.7 },
      { x: -20, y: -5, scale: 0.7 },
      { x: 20, y: -5, scale: 0.7 },
      { x: -12, y: 18, scale: 0.7 },
      { x: 12, y: 18, scale: 0.7 },
    ],
    6: [
      { x: -18, y: -18, scale: 0.65 },
      { x: 18, y: -18, scale: 0.65 },
      { x: -18, y: 0, scale: 0.65 },
      { x: 18, y: 0, scale: 0.65 },
      { x: -18, y: 18, scale: 0.65 },
      { x: 18, y: 18, scale: 0.65 },
    ],
  };

  const border = [];

  // Bottom row (right → left)
  for (let i = size - 1; i >= 0; i--) border.push({ r: size - 1, c: i });
  // Left column (bottom → top)
  for (let i = size - 2; i >= 0; i--) border.push({ r: i, c: 0 });
  // Top row (left → right)
  for (let i = 1; i < size; i++) border.push({ r: 0, c: i });
  // Right column (top → bottom)
  for (let i = 1; i < size - 1; i++) border.push({ r: i, c: size - 1 });

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;

      if (rollCount >= 15) { // Roll animation for 15 times
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalValue);
        setIsRolling(false);

        setTimeout(() => {
          movePlayer(finalValue);
        }, 300);

        console.log(`Dice rolled: ${finalValue}`);
      }
    }, 35);  // Change dice value every 35ms
  }


  const stepAudio = useRef(null);

  useEffect(() => {
    stepAudio.current = new Audio(ludoPieceAudio); // add small tick sound
    stepAudio.current.volume = 0.4;
  }, []);

  const playersOnTile = {};

  players.forEach(player => {
    if (!playersOnTile[player.pos]) {
      playersOnTile[player.pos] = [];
    }
    playersOnTile[player.pos].push(player);
  });

  const movePlayer = (steps) => {
    let step = 0;

    const interval = setInterval(() => {
      setPlayers(prev =>
        prev.map((p, idx) =>
          idx === currentTurn
            ? { ...p, pos: (p.pos + 1) % border.length }
            : p
        )
      );

      step++;
      if (step >= steps) {
        clearInterval(interval);
        setCurrentTurn((prev) => (prev + 1) % players.length);
      }
    }, 320);
  };


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
              const tilePlayers = players.filter(p => p.pos === i);
              const layout = tileLayouts[tilePlayers.length] || tileLayouts[6];
              const key = tileData[i].toLowerCase().replace(/\s+/g, "-");
              return (

                <div
                  key={i}
                  className={`border-cell weapon-tile ${tileData[i].toLowerCase().replace(/\s+/g, '-')}`}
                  style={{
                    gridRow: cell.r + 1,
                    gridColumn: cell.c + 1
                  }}
                >
                  {tileIcons[key] && (
                    <img className="tile-icon" src={tileIcons[key]} alt={tileData[i]} />
                  )}


                  <div className="tile-label">{tileData[i]}</div>
                  {tilePlayers.map((player, idx) => {
                    const slot = layout[idx];

                    return (
                      <img
                        key={player.id}
                        src={player.pawn}
                        className="player-token"
                        style={{
                          transform: `
                translate(${slot.x}px, ${slot.y}px)
                scale(${slot.scale})
              `,
                        }}
                      />
                    );
                  })}
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
        <div className={`dice-container ${isRolling ? "rolling" : ""}`}
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
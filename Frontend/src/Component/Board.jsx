import React from 'react'
import './Board.css'
import './chatSystem.css';
import GameChat from './GameChat.jsx';
import { useState, useEffect, useRef } from 'react'
import logo from "../assets/parliamentlogo.png";
import wallMaria from "../assets/wallMaria.png";
import wallSena from "../assets/wallSena.png";
import wallRose from "../assets/wallRose.png";
import emergency from "../assets/emergency.png";
import diceAudio from "../assets/diceAudio.mp3";
import whitePawn from "../assets/whitePawn.png";
import blackPawn from "../assets/blackPawn.png";
import yellowPawn from "../assets/yellowPawn.png";
import redPawn from "../assets/redPawn.png";
import greenPawn from "../assets/greenPawn.png";
import bluePawn from "../assets/bluePawn.png";
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
import pawnMoveSound from "../assets/pawn.mp3";
import { useCardModal } from '../context/CardModalContext'
import { cardMap } from "../context/CardModalContext";
import CardModal from "../Component/CardModal"
import GameChatContainer from "../Component/gameChatSocket.jsx";
import { getSocket } from "../Component/socket";
import { useLocation } from "react-router-dom";
import { Navigate } from 'react-router-dom';

const Board = () => {
  const location = useLocation();
  const roomId = new URLSearchParams(location.search).get("room");
  const playersInfo = location.state?.players || null;
  const socket = useRef(null);
  const [players, setPlayers] = useState(playersInfo);
  const [sharedRolling, setSharedRolling] = useState(false);
  const [sharedDiceValue, setSharedDiceValue] = useState(1);
  console.log("playersInfo:", playersInfo);
  console.log("players:", players);

  const [turnNo, setTurnNo] = useState(1);
  const tileIcons = {
    "terrorist-attack": terroristIcon,
    "air-strike": airStrikeIcon,
    "nuclear-attack": nuclearAttackIcon,
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
    "safe-zone",

    "Hammer",
    "Double Barrel",
    "Mystery",
    "Scientist",
    "Torpedo",
    "Brahmos",
    "Laser",
    "Shock Wave",

    "Agent",
    "Tank",
    "Machine Gun",
    "Mystery",
    "Engineer",
    "Grenade",
    "Nuclear Attack"
  ];

  const { openCard } = useCardModal();


  // const [players, setPlayers] = useState([
  //   { id: 1, name: "Nihal", pos: 0, pawn: whitePawn },
  //   { id: 2, name: "Tanmay", pos: 0, pawn: blackPawn },
  //   { id: 3, name: "Dhanagar", pos: 0, pawn: yellowPawn },
  //   { id: 4, name: "Shlok", pos: 0, pawn: redPawn },
  //   { id: 5, name: "Gopesh", pos: 0, pawn: greenPawn },
  //   { id: 6, name: "Saurav", pos: 0, pawn: bluePawn },
  // ]);

  const pawnImg = {
    "redPawn": redPawn,
    "blackPawn": blackPawn,
    "greenPawn": greenPawn,
    "bluePawn": bluePawn,
    "yellowPawn": yellowPawn,
    "whitePawn": whitePawn,
  }
  const game = location.state?.game || "";
  console.log("gameSchema:", game);

  const [currentTurn, setCurrentTurn] = useState(game.currentTurn);
  // const [messages, setMessages] = useState([
  //   { id: 1, sender: 'System', content: 'Welcome to Parliament Game!', time: '14:30', type: 'system' },
  //   { id: 2, sender: 'Nihal', content: 'Ready to play!', time: '14:31', type: 'user' },
  //   { id: 3, sender: 'tanmay', content: 'Let\'s start the battle!', time: '14:32', type: 'user' },
  // ]);
  const [optimisticPlayers, setOptimisticPlayers] = useState([]);
  const size = 9;
  //  players.remainingParliamentHp = 400;
  const maxHP = 1000;
  const hpPercent = (players.remainingParliamentHp / maxHP) * 100;

  // Shield values
  // const currentShield = 650;
  const maxShield = 750;
  const shieldPercent = (players.remainingShieldHp / maxShield) * 100;




  const border = [];

  // Bottom row (right → left)
  for (let i = size - 1; i >= 0; i--) border.push({ r: size - 1, c: i });
  // Left column (bottom → top)
  for (let i = size - 2; i >= 0; i--) border.push({ r: i, c: 0 });
  // Top row (left → right)
  for (let i = 1; i < size; i++) border.push({ r: 0, c: i });
  // Right column (top → bottom)
  for (let i = 1; i < size - 1; i++) border.push({ r: i, c: size - 1 });

  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const audioRef = useRef(null);
  const stepAudio = useRef(null);
  // console.log("myUserId:" , myUserId);

  const [myUserId, setMyUserId] = useState(null)
  // const myIndex = players.findIndex(
  //   p => p.userId._id === myUserId
  // );
  useEffect(() => {

    socket.current = getSocket();
    if (!socket.current) return;

    socket.current.on("diceRolling", () => {
      setSharedRolling(true);
    });

    socket.current.on("diceResult", ({ diceValue }) => {
      setSharedDiceValue(diceValue);
      setSharedRolling(false);
    });

        socket.current.on("myUserIdentity", ({ myUserId }) => {
      setMyUserId(myUserId);
      console.log("kyalikhu:", myUserId);
    });

    // 🔥 Ask backend AFTER listener is ready
    socket.current.emit("requestMyIdentity");

    socket.current.on("authoritativeUpdate", ({ players, currentTurn, turnNo }) => {
      setPlayers(players);
      setOptimisticPlayers(players);
      setCurrentTurn(
        players.findIndex(p => p.userId._id === currentTurn)
      );
      setTurnNo(turnNo);
    });
    audioRef.current = new Audio(diceAudio);
    audioRef.current.volume = 1.0;
    stepAudio.current = new Audio(pawnMoveSound);
    stepAudio.current.volume = 0.4;

    return () => {
      socket.current.off('authoritativeUpdate')
      socket.current.off('diceResult')
      socket.current.off('diceRolling')
      socket.current.off("myUserIdentity");
    }
  }, []);

 

  useEffect(() => {
    if (players?.length) {
      setOptimisticPlayers(players);
    }
  }, [players]);

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





  // const rollDice = () => {
  //   if (isRolling) return;
  //   setIsRolling(true);

  //   if (audioRef.current) {
  //     audioRef.current.currentTime = 0;
  //     audioRef.current.play().catch(err => console.log("Audio play failed:", err));
  //   }

  //   let rollCount = 0;
  //   const rollInterval = setInterval(() => {
  //     setDiceValue(Math.floor(Math.random() * 6) + 1);
  //     rollCount++;

  //     if (rollCount >= 15) {
  //       clearInterval(rollInterval);
  //       const finalValue = Math.floor(Math.random() * 6) + 1;
  //       setDiceValue(finalValue);
  //       setIsRolling(false);

  //       setTimeout(() => {
  //         movePlayer(finalValue);
  //       }, 300);

  //       console.log(`Dice rolled: ${finalValue}`);
  //       addMessage('System', `${players[currentTurn].name} rolled: ${finalValue}`, 'system');
  //       const socket = getSocket();
  //       socket.emit("sendMessage", {
  //         roomId,
  //         message: `${players[currentTurn].username} rolled: ${finalValue}`,
  //         type: "system"
  //       });

  //     }
  //   }, 35);
  // }


  const rollDice = () => {
    console.log("roll dice clicked");
    console.log(currentTurn);
    console.log(myUserId);


    if (currentTurn != myUserId) return;
    console.log("return hogaya");

    if (sharedRolling) return;


    // setIsRolling(true);

    socket.current.emit("diceRolling", { roomId });

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log("Audio play failed:", err));
    }

    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setSharedDiceValue(Math.floor(Math.random() * 6) + 1)
      rollCount++;

      if (rollCount >= 15) {
        clearInterval(rollInterval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        setSharedDiceValue(finalValue);
        setSharedRolling(false);

        setTimeout(() => {
          movePlayer(finalValue);
        }, 300);
      }
    }, 35);

    // const dice = Math.floor(Math.random() * 6) + 1;
    console.log("Dice value:", dice);

    // setDiceValue(dice);
    setSharedDiceValue(dice);
    setOptimisticPlayers(prev =>
      prev.map((p, i) =>
        i === currentTurn
          ? { ...p, position: (p.position + dice) % border.length }
          : p
      )
    );

    const nextTurn = (currentTurn + 1) % players.length;
    setCurrentTurn(nextTurn);

    // UI round increment (matches backend)
    if (nextTurn === 0) {
      setTurnNo(prev => prev + 1);
    }
    setTimeout(() => {

      socket.current.emit("rollDice", {
        gameCode: roomId,
        diceValue: dice
      });
    }, 1200);


    socket.current.emit("sendMessage", {
      roomId,
      message: `${players[currentTurn].username} rolled: ${dice}`,
      type: "system"
    });
    setTimeout(() => setIsRolling(false), 600);
  }



  const movePlayer = (steps) => {
    let step = 0;

    const interval = setInterval(() => {
      if (stepAudio.current) {
        stepAudio.current.currentTime = 0;
        stepAudio.current.playbackRate = 0.95 + Math.random() * 0.1;
        stepAudio.current.play().catch(() => { });
      }
      setPlayers(prev =>
        prev.map((p, idx) =>
          idx === currentTurn
            ? { ...p, position: (p.position + 1) % border.length }
            : p
        )
      );

      step++;
      if (step >= steps) {
        clearInterval(interval);
        const newPos = (players[currentTurn].position + steps) % border.length;
        const landedTile = tileData[newPos];
        // addMessage('System', `${players[currentTurn].name} landed on ${landedTile}`, 'system');
        const socket = getSocket();
        socket.emit("sendMessage", {
          roomId,
          message: `${players[currentTurn].username} landed on ${landedTile}`,
          type: "system"
        });

        setCurrentTurn((prev) => (prev + 1) % players.length);
      }
    }, 320);
  };


  return (

    <div className="hero2 min-h-screen bg-gradient-to-br from-indigo-950 to-black p-6">
      <CardModal />

      {/* <GameChat messages={messages} addMessage={addMessage} /> */}
      <GameChatContainer />


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
              const tilePlayers = optimisticPlayers.filter(p => p.position === i);
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
                  onClick={() => openCard(cardMap[key])}


                >
                  {tileIcons[key] && (
                    <img className="tile-icon" src={tileIcons[key]} alt={tileData[i]} />
                  )}

                  <div className="tile-label">{tileData[i]}</div>
                  {tilePlayers.map((player, idx) => {
                    const slot = layout[idx];

                    return (
                      <img
                        key={player._id}
                        src={pawnImg[player.pawn]}
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
                {optimisticPlayers.map((player, i) => (
                  <div key={i} className={`player-cell ${player.remainingParliamentHp <= 300 ? "low" : ""}`}>
                    <div className="image-parent">
                      <div className="name">
                        <span>{player?.userId.username}</span>
                      </div>
                      <img src={logo} className="parl" alt={`Player ${player?.userId.username}`} />
                      <div className={`hp-bar ${hpPercent <= 30 ? "low" : ""}`}>
                        <div className="hp-fill" style={{ width: `${hpPercent}%` }} />
                        <span className="hp-text">{player.remainingParliamentHp} / {maxHP}</span>
                      </div>
                      <div className="shield-bar">
                        <div className="shield-fill" style={{ width: `${shieldPercent}%` }} />
                        <span className="shield-text">{player.remainingShieldHp} / {maxShield}</span>
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
          {[
            { key: "emergency-meeting", img: emergency },
            { key: "wall-sena", img: wallSena },
            { key: "wall-maria", img: wallMaria },
            { key: "wall-rose", img: wallRose },
          ].map((item, i) => (
            <div
              key={i}
              className="right-cell"
              onClick={() => openCard(cardMap[item.key])}
            >
              <img src={item.img} alt={item.key} />
            </div>
          ))}
        </div>

        <div
          className={`dice-container ${sharedRolling ? "rolling" : "pop"}`}
          onClick={rollDice}
        >
          <div className="dice-display">
            <div className={`dice-face face-${sharedDiceValue}`}>
              {[...Array(9)].map((_, i) => (
                <span key={i} className="pip" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board
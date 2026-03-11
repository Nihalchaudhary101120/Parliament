// import React from 'react'

// import './Board.css'
// import './chatSystem.css';
// import GameChat from './GameChat.jsx';
// import { useState, useEffect, useRef } from 'react'
// import logo from "../assets/parliamentlogo.png";
// import wallMaria from "../assets/wallMaria.png";
// import wallSena from "../assets/wallSena.png";
// import wallRose from "../assets/wallRose.png";
// import emergency from "../assets/emergency.png";
// import diceAudio from "../assets/diceAudio.mp3";
// import whitePawn from "../assets/whitePawn.png";
// import blackPawn from "../assets/blackPawn.png";
// import yellowPawn from "../assets/yellowPawn.png";
// import redPawn from "../assets/redPawn.png";
// import greenPawn from "../assets/greenPawn.png";
// import bluePawn from "../assets/bluePawn.png";
// import mineIcon from "../assets/icons/mine.png";
// import missileIcon from "../assets/icons/missile.png";
// import radiationIcon from "../assets/icons/radiation.png";
// import grenadeIcon from "../assets/icons/grenade.png";
// import hammerIcon from "../assets/icons/hammer.png";
// import mysteryIcon from "../assets/icons/mystery.png";
// import scientistIcon from "../assets/icons/scientist.png";
// import tankIcon from "../assets/icons/tank.png";
// import laserIcon from "../assets/icons/lasergun.png";
// import shockwaveIcon from "../assets/icons/shock.png";
// import agentIcon from "../assets/icons/agent.png";
// import engineerIcon from "../assets/icons/engineer.png";
// import startIcon from "../assets/icons/flag.png";
// import terroristIcon from "../assets/icons/terrorist.png";
// import airStrikeIcon from "../assets/icons/air.png";
// import nuclearAttackIcon from "../assets/icons/nuclear.png";
// import canonIcon from "../assets/icons/canon.png";
// import shotgunIcon from "../assets/icons/shotgun.png";
// import revolverIcon from "../assets/icons/revolver.png";
// import machineGunIcon from "../assets/icons/machinegun.png";
// import tsunamiIcon from "../assets/icons/tsunami.png";
// import timeBombIcon from "../assets/icons/time-bomb.png";
// import torpedoIcon from "../assets/icons/torpedo.png";
// import safeZoneIcon from "../assets/icons/safe-zone.png";
// import brahmosIcon from "../assets/icons/brahmos.png";
// import pawnMoveSound from "../assets/pawn.mp3";
// import { useCardModal } from '../context/CardModalContext'
// import { cardMap } from "../context/CardModalContext";
// import CardModal from "../Component/CardModal"
// import GameChatContainer from "../Component/gameChatSocket.jsx";
// import { getSocket } from "../Component/socket";
// import { useLocation } from "react-router-dom";
// import { Navigate } from 'react-router-dom';

// const Board = () => {
//   const location = useLocation();
//   const roomId = new URLSearchParams(location.search).get("room");
//   let playersInfo = location.state?.players || null;
//   const socket = useRef(null);
//   const [sharedRolling, setSharedRolling] = useState(false);
//   const [sharedDiceValue, setSharedDiceValue] = useState(2);
//   console.log("playersInfo:", playersInfo);
//   // console.log("players:", players);

//   const [turnNo, setTurnNo] = useState(1);
//   const tileIcons = {
//     "terrorist-attack": terroristIcon,
//     "air-strike": airStrikeIcon,
//     "nuclear-attack": nuclearAttackIcon,
//     "mine": mineIcon,
//     "ballistic-missile": missileIcon,
//     "dragon-cannon": canonIcon,
//     "radiation-zone": radiationIcon,
//     "grenade": grenadeIcon,
//     "hammer": hammerIcon,
//     "mystery": mysteryIcon,
//     "scientist": scientistIcon,
//     "tank": tankIcon,
//     "laser": laserIcon,
//     "shock-wave": shockwaveIcon,
//     "agent": agentIcon,
//     "revolver": revolverIcon,
//     "engineer": engineerIcon,
//     "start": startIcon,
//     "double-barrel": shotgunIcon,
//     "tsunami": tsunamiIcon,
//     "machine-gun": machineGunIcon,
//     "time-bomb": timeBombIcon,
//     "torpedo": torpedoIcon,
//     "brahmos": brahmosIcon,
//     "safe-zone": safeZoneIcon,
//   };


//   const tileData = [
//     "Start",
//     "Mine",
//     "Mystery",
//     "Radiation Zone",
//     "Scientist",
//     "Dragon Cannon",
//     "Engineer",
//     "Ballistic Missile",
//     "Terrorist Attack",

//     "Agent",
//     "Tsunami",
//     "Mystery",
//     "Revolver",
//     "Engineer",
//     "Time Bomb",
//     "Air Strike",
//     "safe-zone",

//     "Hammer",
//     "Double Barrel",
//     "Mystery",
//     "Scientist",
//     "Torpedo",
//     "Brahmos",
//     "Laser",
//     "Shock Wave",

//     "Agent",
//     "Tank",
//     "Machine Gun",
//     "Mystery",
//     "Engineer",
//     "Grenade",
//     "Nuclear Attack"
//   ];

//   const { openCard } = useCardModal();




//   // const [players, setPlayers] = useState([
//   //   { id: 1, name: "Nihal", pos: 0, pawn: whitePawn },
//   //   { id: 2, name: "Tanmay", pos: 0, pawn: blackPawn },
//   //   { id: 3, name: "Dhanagar", pos: 0, pawn: yellowPawn },
//   //   { id: 4, name: "Shlok", pos: 0, pawn: redPawn },
//   //   { id: 5, name: "Gopesh", pos: 0, pawn: greenPawn },
//   //   { id: 6, name: "Saurav", pos: 0, pawn: bluePawn },
//   // ]);

//   const pawnImg = {
//     "redPawn": redPawn,
//     "blackPawn": blackPawn,
//     "greenPawn": greenPawn,
//     "bluePawn": bluePawn,
//     "yellowPawn": yellowPawn,
//     "whitePawn": whitePawn,
//   }
//   const game = location.state?.game || "";
//   playersInfo = game?.players || "";
//   console.log("game.playesr", playersInfo);
//   const [players, setPlayers] = useState(playersInfo);
//   console.log("gameSchema:", game);

//   const [currentTurn, setCurrentTurn] = useState(game.currentTurn);
//   const currentTurnRef = useRef(game.currentTurn);
//   // const [messages, setMessages] = useState([
//   //   { id: 1, sender: 'System', content: 'Welcome to Parliament Game!', time: '14:30', type: 'system' },
//   //   { id: 2, sender: 'Nihal', content: 'Ready to play!', time: '14:31', type: 'user' },
//   //   { id: 3, sender: 'tanmay', content: 'Let\'s start the battle!', time: '14:32', type: 'user' },
//   // ]);
//   const [optimisticPlayers, setOptimisticPlayers] = useState([]);
//   const optimisticPlayersRef = useRef([]);

//   const updateOptmisticPlayers = (val) => {
//     optimisticPlayersRef.current = val;
//     setOptimisticPlayers(val);
//   }

//   const size = 9;
//   //  players.remainingParliamentHp = 400;
//   const maxHP = 1000;
//   const hpPercent = (players.remainingParliamentHp / maxHP) * 100;

//   // Shield values
//   // const currentShield = 650;
//   const maxShield = 750;
//   const shieldPercent = (players.remainingShieldHp / maxShield) * 100;




//   const border = [];

//   // Bottom row (right → left)
//   for (let i = size - 1; i >= 0; i--) border.push({ r: size - 1, c: i });
//   // Left column (bottom → top)
//   for (let i = size - 2; i >= 0; i--) border.push({ r: i, c: 0 });
//   // Top row (left → right)
//   for (let i = 1; i < size; i++) border.push({ r: 0, c: i });
//   // Right column (top → bottom)
//   for (let i = 1; i < size - 1; i++) border.push({ r: i, c: size - 1 });

//   // const [diceValue, setDiceValue] = useState(1);
//   // const [isRolling, setIsRolling] = useState(false);
//   const audioRef = useRef(null);
//   const stepAudio = useRef(null);
//   // console.log("myUserId:" , myUserId);

//   const [myUserId, setMyUserId] = useState(null);
//   const myUserIdRef = useRef(null);
//   // const myIndex = players.findIndex(
//   //   p => p.userId._id === myUserId
//   // );
//   useEffect(() => {

//     socket.current = getSocket();
//     if (!socket.current) return;

//     socket.current.on("diceRolling", () => {
//       setSharedRolling(true);
//     });

//     socket.current.on("diceResult", async ({ diceValue, previousTurn }) => {
//       setSharedDiceValue(diceValue);
//       setSharedRolling(false);
//       console.log("diceResult received", diceValue);

//       console.log("diceResult received");
//       console.log("previousTurn:", previousTurn);
//       console.log("myUserId:", myUserIdRef.current);

//       const movingIndex = optimisticPlayersRef.current.findIndex(
//         p => p.userId._id.toString() === previousTurn.toString()
//       );

//       if (movingIndex === -1) {
//         console.log("Player not found for animation");
//         return;
//       }

//       await animateMove(diceValue, movingIndex);

//       if (String(previousTurn) === String(myUserIdRef.current)) {
//         console.log("Emitting playTurn");
//         socket.current.emit("playTurn", {
//           gameCode: roomId,
//           dice: diceValue
//         });
//       }
//     });



//     socket.current.on("myUserIdentity", ({ myUserId }) => {
//       setMyUserId(myUserId);
//       myUserIdRef.current = myUserId;
//       console.log("kyalikhu:", myUserId);
//     });

//     // 🔥 Ask backend AFTER listener is ready
//     socket.current.emit("requestMyIdentity");


//     audioRef.current = new Audio(diceAudio);
//     audioRef.current.volume = 1.0;
//     stepAudio.current = new Audio(pawnMoveSound);
//     stepAudio.current.volume = 0.4;



//     socket.current.on("turnResult", ({ players, currentTurn, turnNo, mysteryCase }) => {

//       setPlayers(players);
//       updateOptmisticPlayers(players);
//       setCurrentTurn(currentTurn);
//       currentTurnRef.current = currentTurn;
//       setTurnNo(turnNo);
//       setMysteryCase(mysteryCase);

//     });

//     return () => {
//       socket.current.off('authoritativeUpdate')
//       socket.current.off('diceResult')
//       socket.current.off('diceRolling')
//       socket.current.off("myUserIdentity");


//       socket.current.off("turnResult");
//     }
//   }, []);



//   useEffect(() => {
//     if (players?.length) {
//       updateOptmisticPlayers(players);
//     }
//   }, [players]);

//   const tileLayouts = {
//     1: [{ x: 0, y: 0, scale: 1 }],
//     2: [
//       { x: -18, y: 0, scale: 0.85 },
//       { x: 18, y: 0, scale: 0.85 },
//     ],
//     3: [
//       { x: 0, y: -18, scale: 0.8 },
//       { x: -18, y: 18, scale: 0.8 },
//       { x: 18, y: 18, scale: 0.8 },
//     ],
//     4: [
//       { x: -18, y: -18, scale: 0.75 },
//       { x: 18, y: -18, scale: 0.75 },
//       { x: -18, y: 18, scale: 0.75 },
//       { x: 18, y: 18, scale: 0.75 },
//     ],
//     5: [
//       { x: 0, y: -22, scale: 0.7 },
//       { x: -20, y: -5, scale: 0.7 },
//       { x: 20, y: -5, scale: 0.7 },
//       { x: -12, y: 18, scale: 0.7 },
//       { x: 12, y: 18, scale: 0.7 },
//     ],
//     6: [
//       { x: -18, y: -18, scale: 0.65 },
//       { x: 18, y: -18, scale: 0.65 },
//       { x: -18, y: 0, scale: 0.65 },
//       { x: 18, y: 0, scale: 0.65 },
//       { x: -18, y: 18, scale: 0.65 },
//       { x: 18, y: 18, scale: 0.65 },
//     ],
//   };





//   // const rollDice = () => {
//   //   if (isRolling) return;
//   //   setIsRolling(true);

//   //   if (audioRef.current) {
//   //     audioRef.current.currentTime = 0;
//   //     audioRef.current.play().catch(err => console.log("Audio play failed:", err));
//   //   }

//   //   let rollCount = 0;
//   //   const rollInterval = setInterval(() => {
//   //     setDiceValue(Math.floor(Math.random() * 6) + 1);
//   //     rollCount++;

//   //     if (rollCount >= 15) {
//   //       clearInterval(rollInterval);
//   //       const finalValue = Math.floor(Math.random() * 6) + 1;
//   //       setDiceValue(finalValue);
//   //       setIsRolling(false);

//   //       setTimeout(() => {
//   //         movePlayer(finalValue);
//   //       }, 300);

//   //       console.log(`Dice rolled: ${finalValue}`);
//   //       addMessage('System', `${players[currentTurn].name} rolled: ${finalValue}`, 'system');
//   //       const socket = getSocket();
//   //       socket.emit("sendMessage", {
//   //         roomId,
//   //         message: `${players[currentTurn].username} rolled: ${finalValue}`,
//   //         type: "system"
//   //       });

//   //     }
//   //   }, 35);
//   // }


//   // const rollDice = () => {
//   //   if (currentTurn != myUserId) return;
//   //   console.log("return hogaya");

//   //   if (sharedRolling) return;


//   //   if (audioRef.current) {
//   //     audioRef.current.currentTime = 0;
//   //     audioRef.current.play().catch(err => console.log("Audio play failed:", err));
//   //   }

//   //   let rollCount = 0;
//   //   const rollInterval = setInterval(() => {
//   //     setSharedDiceValue(Math.floor(Math.random() * 6) + 1)
//   //     rollCount++;

//   //     if (rollCount >= 10) {
//   //       clearInterval(rollInterval);
//   //       setSharedRolling(false);

//   //       setTimeout(() => {
//   //         // movePlayer(sharedDiceValue);
//   //       }, 300);
//   //     }
//   //   }, 35);

//   //   // const dice = Math.floor(Math.random() * 6) + 1;
//   //   console.log("Dice value:", sharedDiceValue);

//   //   // setDiceValue(dice);
//   //   // setSharedDiceValue(dice);
//   //   // const nextTurn = (currentTurn + 1) % players.length;
//   //   // setCurrentTurn(nextTurn);
//   //   const myIndex = players.findIndex(
//   //     p => p.userId._id === currentTurn
//   //   );

//   //   const nextTurn = (myIndex + 1) % players.length;

//   //   socket.current.emit("rollDice", {
//   //     gameCode: roomId,
//   //   });

//   //   socket.current.emit("sendMessage", {
//   //     roomId,
//   //     message: `${players[myIndex].userId.username} rolled: ${sharedDiceValue}`,
//   //     type: "system"
//   //   });
//   //   setTimeout(() => setSharedRolling(false), 600);
//   // }
//   const [mysteryCase, setMysteryCase] = useState({});

//   const rollDice = () => {

//     console.log("current turn kiski thi ", currentTurnRef.current);
//     console.log("meri id kiya thi", myUserIdRef.current);
//     if (currentTurnRef.current?.toString() !== myUserIdRef.current?.toString()) return;


//     console.log("Sending rollDice event");
//     console.log("sharedRolling:", sharedRolling);
//     if (sharedRolling) return;

//     if (audioRef.current) {
//       audioRef.current.currentTime = 0;
//       audioRef.current.play().catch(err => console.log("Audio play failed:", err));
//     }
//     socket.current.emit("rollDice", {
//       gameCode: roomId,
//     });

//   };


//   // const movePlayer = (steps) => {
//   //   let step = 0;
//   //   const interval = setInterval(() => {
//   //     if (stepAudio.current) {
//   //       stepAudio.current.currentTime = 0;
//   //       stepAudio.current.playbackRate = 0.95 + Math.random() * 0.1;
//   //       stepAudio.current.play().catch(() => { });
//   //     }
//   //     setPlayers(prev =>
//   //       prev.map((p, idx) =>
//   //         idx === currentTurn
//   //           ? { ...p, position: (p.position + 1) % border.length }
//   //           : p
//   //       )
//   //     );
//   //     step++;
//   //     if (step >= steps) {
//   //       clearInterval(interval);
//   //       const newPos = (players[currentTurn]?.position + steps) % border.length;
//   //       const landedTile = tileData[newPos];
//   //       // addMessage('System', `${players[currentTurn].name} landed on ${landedTile}`, 'system');
//   //       const socket = getSocket();
//   //       socket.emit("sendMessage", {
//   //         roomId,
//   //         message: `${players[currentTurn].username} landed on ${landedTile}`,
//   //         type: "system"
//   //       });

//   //       setCurrentTurn((prev) => (prev + 1) % players.length);
//   //     }
//   //   }, 320);
//   // };

//   const animateMove = (steps, movingIndex) => {
//     return new Promise((resolve) => {

//       let step = 0;

//       const interval = setInterval(() => {

//         if (stepAudio.current) {
//           stepAudio.current.currentTime = 0;
//           stepAudio.current.play().catch(() => { });
//         }

//         updateOptmisticPlayers(
//           optimisticPlayersRef.current.map((p, idx) =>
//             idx === movingIndex
//               ? { ...p, position: (p.position + 1) % border.length }
//               : p
//           )
//         );

//         step++;

//         if (step >= steps) {
//           clearInterval(interval);
//           resolve();
//         }

//       }, 320);

//     });
//   };


//   return (

//     <div className="hero2 min-h-screen bg-gradient-to-br from-indigo-950 to-black p-6">
//       <CardModal />

//       {/* <GameChat messages={messages} addMessage={addMessage} /> */}
//       <GameChatContainer players={players} />


//       {/* Board - Centered */}
//       <div className="board-wrapper">
//         <div className="bg-transparent p-6 rounded-3xl shadow-2xl">
//           <div
//             className="grid gap-2 bg-transparent p-4 rounded-2xl"
//             style={{
//               gridTemplateColumns: `repeat(${size}, 90px)`,
//               gridTemplateRows: `repeat(${size}, 70px)`,
//             }}
//           >

//             {border.map((cell, i) => {
//               const tilePlayers = optimisticPlayers.filter(p => p.position === i);
//               const layout = tileLayouts[tilePlayers.length] || tileLayouts[6];
//               const key = tileData[i].toLowerCase().replace(/\s+/g, "-");
//               return (

//                 <div
//                   key={i}
//                   className={`border-cell weapon-tile ${tileData[i].toLowerCase().replace(/\s+/g, '-')}`}
//                   style={{
//                     gridRow: cell.r + 1,
//                     gridColumn: cell.c + 1
//                   }}
//                   onClick={() => openCard(cardMap[key])}


//                 >
//                   {tileIcons[key] && (
//                     <img className="tile-icon" src={tileIcons[key]} alt={tileData[i]} />
//                   )}

//                   <div className="tile-label">{tileData[i]}</div>
//                   {tilePlayers.map((player, idx) => {
//                     const slot = layout[idx];

//                     return (
//                       <img
//                         key={player._id}
//                         src={pawnImg[player.pawn]}
//                         className="player-token"
//                         style={{
//                           transform: `
//                   translate(${slot.x}px, ${slot.y}px)
//                   scale(${slot.scale})
//                 `,
//                         }}
//                       />
//                     );
//                   })}
//                 </div>
//               );
//             })}

//             {/* Center Area */}
//             <div
//               className="bg-transparent center-area backdrop-blur-sm rounded-2xl"
//               style={{
//                 gridRow: "2 / span 7",
//                 gridColumn: "2 / span 7"
//               }}
//             >
//               <div className="center-grid">
//                 {optimisticPlayers.map((player, i) => (
//                   <div key={i} className={`player-cell ${player.remainingParliamentHp <= 300 ? "low" : ""}`}>
//                     <div className="image-parent">
//                       <div className="name">
//                         <span>{player?.userId.username}</span>
//                       </div>
//                       <img src={logo} className="parl" alt={`Player ${player?.userId.username}`} />
//                       <div className={`hp-bar ${hpPercent <= 30 ? "low" : ""}`}>
//                         <div className="hp-fill" style={{ width: `${hpPercent}%` }} />
//                         <span className="hp-text">{player.remainingParliamentHp} / {maxHP}</span>
//                       </div>
//                       <div className="shield-bar">
//                         <div className="shield-fill" style={{ width: `${shieldPercent}%` }} />
//                         <span className="shield-text">{player.remainingShieldHp} / {maxShield}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right Side Container - Positioned on Right */}
//       <div className='right-container'>
//         <div className="right-grid">
//           {[
//             { key: "emergency-meeting", img: emergency },
//             { key: "wall-sena", img: wallSena },
//             { key: "wall-maria", img: wallMaria },
//             { key: "wall-rose", img: wallRose },
//           ].map((item, i) => (
//             <div
//               key={i}
//               className="right-cell"
//               onClick={() => openCard(cardMap[item.key])}
//             >
//               <img src={item.img} alt={item.key} />
//             </div>
//           ))}
//         </div>

//         <div
//           className={`dice-container ${sharedRolling ? "rolling" : "pop"}`}
//           onClick={rollDice}
//         >
//           <div className="dice-display">
//             <div className={`dice-face face-${sharedDiceValue}`}>
//               {[...Array(9)].map((_, i) => (
//                 <span key={i} className="pip" />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Board




import React from 'react'
import './Board.css'
import './chatSystem.css';
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
import { useCardModal } from '../context/CardModalContext';
import { cardMap } from "../context/CardModalContext";
import CardModal from "../Component/CardModal";
import GameChatContainer from "../Component/gameChatSocket.jsx";
import { getSocket } from "../Component/socket";
import { useLocation, useNavigate } from "react-router-dom";

const Board = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomId = new URLSearchParams(location.search).get("room");

  const game = location.state?.game || null;
  console.log("game from lobby", game);

  // ── Refs (never go stale inside socket callbacks)
  const socket = useRef(null);
  const audioRef = useRef(null);
  const stepAudio = useRef(null);
  const myUserIdRef = useRef(null);
  const currentTurnRef = useRef(game?.currentTurn || null);
  const optimisticPlayersRef = useRef([]);
  const hasEmittedPlayTurn = useRef(false); // prevents duplicate playTurn emits

  // ── State
  const [myUserId, setMyUserId] = useState(null);
  const [players, setPlayers] = useState(game?.players || []);
  const [optimisticPlayers, setOptimisticPlayers] = useState(game?.players || []);
  const [currentTurn, setCurrentTurn] = useState(game?.currentTurn || null);
  const [turnNo, setTurnNo] = useState(game?.turnNo || 1);
  const [sharedRolling, setSharedRolling] = useState(false);
  const [sharedDiceValue, setSharedDiceValue] = useState(1);
  const [mysteryCase, setMysteryCase] = useState(null);
  const [gameOver, setGameOver] = useState(null); // { winner }

  // ── Buy/Bid modal state
  const [actionModal, setActionModal] = useState(null);
  // actionModal = { type, card: { id, name, price }, playerCash } | null

  const { openCard } = useCardModal();

  // ── Pawn images
  const pawnImg = {
    redPawn, blackPawn, greenPawn, bluePawn, yellowPawn, whitePawn,
  };

  // ── Board
  const size = 9;
  const maxHP = 1000;
  const maxShield = 750;

  const border = [];
  for (let i = size - 1; i >= 0; i--) border.push({ r: size - 1, c: i });
  for (let i = size - 2; i >= 0; i--) border.push({ r: i, c: 0 });
  for (let i = 1; i < size; i++)      border.push({ r: 0, c: i });
  for (let i = 1; i < size - 1; i++) border.push({ r: i, c: size - 1 });

  const tileData = [
    "Start", "Mine", "Mystery", "Radiation Zone", "Scientist",
    "Dragon Cannon", "Engineer", "Ballistic Missile", "Terrorist Attack",
    "Agent", "Tsunami", "Mystery", "Revolver", "Engineer",
    "Time Bomb", "Air Strike", "safe-zone",
    "Hammer", "Double Barrel", "Mystery", "Scientist",
    "Torpedo", "Brahmos", "Laser", "Shock Wave",
    "Agent", "Tank", "Machine Gun", "Mystery",
    "Engineer", "Grenade", "Nuclear Attack",
  ];

  const tileIcons = {
    "terrorist-attack": terroristIcon, "air-strike": airStrikeIcon,
    "nuclear-attack": nuclearAttackIcon, "mine": mineIcon,
    "ballistic-missile": missileIcon, "dragon-cannon": canonIcon,
    "radiation-zone": radiationIcon, "grenade": grenadeIcon,
    "hammer": hammerIcon, "mystery": mysteryIcon,
    "scientist": scientistIcon, "tank": tankIcon,
    "laser": laserIcon, "shock-wave": shockwaveIcon,
    "agent": agentIcon, "revolver": revolverIcon,
    "engineer": engineerIcon, "start": startIcon,
    "double-barrel": shotgunIcon, "tsunami": tsunamiIcon,
    "machine-gun": machineGunIcon, "time-bomb": timeBombIcon,
    "torpedo": torpedoIcon, "brahmos": brahmosIcon,
    "safe-zone": safeZoneIcon,
  };

  const tileLayouts = {
    1: [{ x: 0, y: 0, scale: 1 }],
    2: [{ x: -18, y: 0, scale: 0.85 }, { x: 18, y: 0, scale: 0.85 }],
    3: [{ x: 0, y: -18, scale: 0.8 }, { x: -18, y: 18, scale: 0.8 }, { x: 18, y: 18, scale: 0.8 }],
    4: [{ x: -18, y: -18, scale: 0.75 }, { x: 18, y: -18, scale: 0.75 }, { x: -18, y: 18, scale: 0.75 }, { x: 18, y: 18, scale: 0.75 }],
    5: [{ x: 0, y: -22, scale: 0.7 }, { x: -20, y: -5, scale: 0.7 }, { x: 20, y: -5, scale: 0.7 }, { x: -12, y: 18, scale: 0.7 }, { x: 12, y: 18, scale: 0.7 }],
    6: [{ x: -18, y: -18, scale: 0.65 }, { x: 18, y: -18, scale: 0.65 }, { x: -18, y: 0, scale: 0.65 }, { x: 18, y: 0, scale: 0.65 }, { x: -18, y: 18, scale: 0.65 }, { x: 18, y: 18, scale: 0.65 }],
  };

  // ── Helpers
  const updateOptimisticPlayers = (val) => {
    optimisticPlayersRef.current = val;
    setOptimisticPlayers(val);
  };

  const animateMove = (steps, movingIndex) => {
    return new Promise((resolve) => {
      let step = 0;
      const interval = setInterval(() => {
        if (stepAudio.current) {
          stepAudio.current.currentTime = 0;
          stepAudio.current.play().catch(() => { });
        }
        updateOptimisticPlayers(
          optimisticPlayersRef.current.map((p, idx) =>
            idx === movingIndex
              ? { ...p, position: (p.position + 1) % border.length }
              : p
          )
        );
        step++;
        if (step >= steps) { clearInterval(interval); resolve(); }
      }, 320);
    });
  };

  // ── Socket setup
  useEffect(() => {
    if (!game) return;

    socket.current = getSocket();
    if (!socket.current) return;

    audioRef.current = new Audio(diceAudio);
    audioRef.current.volume = 1.0;
    stepAudio.current = new Audio(pawnMoveSound);
    stepAudio.current.volume = 0.4;

    // Initialise optimistic players from game state
    updateOptimisticPlayers(game.players);

    // ── identity: server sends our userId on connect (no requestMyIdentity needed)
    socket.current.off("identity");
    socket.current.on("identity", ({ myUserId }) => {
      myUserIdRef.current = myUserId;
      setMyUserId(myUserId);
    });

    socket.current.emit("joinLobby", { gameCode: roomId });

    // ── diceResult: animate pawn, then emit playTurn (no dice value sent)
    socket.current.off("diceResult");
    socket.current.on("diceResult", async ({ diceValue, rolledBy, players: updatedPlayers }) => {
      setSharedDiceValue(diceValue);
      setSharedRolling(false);

      // Sync players from server before animation
      updateOptimisticPlayers(updatedPlayers);

      const movingIndex = optimisticPlayersRef.current.findIndex(
        p => p.userId._id.toString() === rolledBy.toString()
      );

      if (movingIndex === -1) return;

      await animateMove(diceValue, movingIndex);

      // Only the player whose turn it was emits playTurn
      // hasEmittedPlayTurn prevents double-emit if diceResult fires twice
      if (rolledBy.toString() === myUserIdRef.current?.toString()) {
        if (hasEmittedPlayTurn.current) return;
        hasEmittedPlayTurn.current = true;

        // ⚠️ No dice value sent — server uses its own pendingDice
        socket.current.emit("playTurn", { gameCode: roomId });
      }
    });

    // ── turnResult: normal turn end, advance to next player
    socket.current.off("turnResult");
    socket.current.on("turnResult", ({ players: updatedPlayers, currentTurn: nextTurn, turnNo: newTurnNo, mysteryCase: mc }) => {
      hasEmittedPlayTurn.current = false;

      setPlayers(updatedPlayers);
      updateOptimisticPlayers(updatedPlayers);

      setCurrentTurn(nextTurn);
      currentTurnRef.current = nextTurn;

      setTurnNo(newTurnNo);
      if (mc) setMysteryCase(mc);
    });

    // ── boardUpdate: position synced but turn not advanced yet (buy/bid pause)
    socket.current.off("boardUpdate");
    socket.current.on("boardUpdate", ({ players: updatedPlayers }) => {
      setPlayers(updatedPlayers);
      updateOptimisticPlayers(updatedPlayers);
    });

    // ── actionRequired: show buy/bid/skip modal to the active player
    socket.current.off("actionRequired");
    socket.current.on("actionRequired", ({ type, card, playerCash }) => {
      setActionModal({ type, card, playerCash });
    });

    // ── gameOver
    socket.current.off("gameOver");
    socket.current.on("gameOver", ({ winner, players: finalPlayers }) => {
      setPlayers(finalPlayers);
      updateOptimisticPlayers(finalPlayers);
      setGameOver({ winner });
    });

    return () => {
      socket.current.off("identity");
      socket.current.off("diceResult");
      socket.current.off("turnResult");
      socket.current.off("boardUpdate");
      socket.current.off("joinLobby");
      socket.current.off("actionRequired");
      socket.current.off("gameOver");
    };
  }, []);

  // ── Roll dice (client-side guard, server does the real check)
  const rollDice = () => {
    if (currentTurnRef.current?.toString() !== myUserIdRef.current?.toString()) return;
    if (sharedRolling) return;
    if (actionModal) return; // can't roll during a pending action

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }

    setSharedRolling(true);
    socket.current.emit("rollDice", { gameCode: roomId });
  };

  // ── Buy / Skip handlers
  const handleBuy = () => {
    socket.current.emit("playerAction", { gameCode: roomId, action: "buy" });
    setActionModal(null);
    hasEmittedPlayTurn.current = false;
  };

  const handleSkip = () => {
    socket.current.emit("playerAction", { gameCode: roomId, action: "skip" });
    setActionModal(null);
    hasEmittedPlayTurn.current = false;
  };

  // ── isMyTurn helper for UI feedback
  const isMyTurn = currentTurn?.toString() === myUserId?.toString();

  return (
    <div className="hero2 min-h-screen bg-gradient-to-br from-indigo-950 to-black p-6">
      <CardModal />
      <GameChatContainer players={players} />

      {/* ── Game Over Overlay ── */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-gray-900 border border-yellow-500 rounded-2xl p-10 text-center">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">Game Over</h2>
            <p className="text-white text-xl mb-6">
              Winner: {
                optimisticPlayers.find(p =>
                  p.userId._id?.toString() === gameOver.winner?.toString()
                )?.userId?.username || "Unknown"
              }
            </p>
            <button
              className="px-6 py-2 bg-yellow-500 text-black rounded-xl font-bold"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* ── Buy / Bid Modal ── */}
      {actionModal && isMyTurn && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 border border-cyan-500 rounded-2xl p-8 text-center min-w-[300px]">
            <h3 className="text-2xl font-bold text-cyan-300 mb-2">
              {actionModal.card.name}
            </h3>
            <p className="text-white mb-1">
              Price: <span className="text-yellow-400 font-bold">${actionModal.card.price}</span>
            </p>
            <p className="text-gray-400 mb-6">
              Your cash: <span className="text-green-400">${actionModal.playerCash}</span>
            </p>
            <div className="flex gap-4 justify-center">
              {actionModal.playerCash >= actionModal.card.price && (
                <button
                  className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold"
                  onClick={handleBuy}
                >
                  Buy
                </button>
              )}
              <button
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-bold"
                onClick={handleSkip}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mystery Card Popup ── */}
      {mysteryCase && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 bg-gray-900 border border-purple-500 rounded-xl px-6 py-3 text-center shadow-xl">
          <p className="text-purple-300 font-semibold">{mysteryCase.statement}</p>
          <p className={`text-lg font-bold ${mysteryCase.amount > 0 ? "text-green-400" : "text-red-400"}`}>
            {mysteryCase.amount > 0 ? `+$${mysteryCase.amount}` : `-$${Math.abs(mysteryCase.amount)}`}
          </p>
        </div>
      )}

      {/* ── Turn Indicator ── */}
      <div className="fixed top-4 right-4 z-20 bg-gray-900/90 border border-cyan-700 rounded-xl px-4 py-2 text-sm text-white">
        {isMyTurn
          ? <span className="text-green-400 font-bold">Your Turn</span>
          : <span className="text-gray-400">Waiting...</span>
        }
        <span className="ml-2 text-gray-500">Turn #{turnNo}</span>
      </div>

      {/* ── Board ── */}
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
              const layout = tileLayouts[Math.min(tilePlayers.length, 6)] || tileLayouts[6];
              const key = tileData[i].toLowerCase().replace(/\s+/g, "-");

              return (
                <div
                  key={i}
                  className={`border-cell weapon-tile ${tileData[i].toLowerCase().replace(/\s+/g, '-')}`}
                  style={{ gridRow: cell.r + 1, gridColumn: cell.c + 1 }}
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
                          transform: `translate(${slot.x}px, ${slot.y}px) scale(${slot.scale})`,
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}

            {/* ── Center Area ── */}
            <div
              className="bg-transparent center-area backdrop-blur-sm rounded-2xl"
              style={{ gridRow: "2 / span 7", gridColumn: "2 / span 7" }}
            >
              <div className="center-grid">
                {optimisticPlayers.map((player, i) => {
                  const hp = player.remainingParliamentHp;
                  const shield = player.remainingShieldHp;
                  const hpPct = (hp / maxHP) * 100;
                  const shPct = (shield / maxShield) * 100;
                  const isThisTurn = currentTurn?.toString() === player.userId._id?.toString();

                  return (
                    <div
                      key={i}
                      className={`player-cell ${hp <= 300 ? "low" : ""} ${isThisTurn ? "active-turn" : ""}`}
                    >
                      <div className="image-parent">
                        <div className="name">
                          <span>{player.userId.username}</span>
                          {isThisTurn && (
                            <span className="text-xs text-green-400 ml-1">▶</span>
                          )}
                        </div>

                        <img src={logo} className="parl" alt={player.userId.username} />

                        {/* HP bar */}
                        <div className={`hp-bar ${hpPct <= 30 ? "low" : ""}`}>
                          <div className="hp-fill" style={{ width: `${hpPct}%` }} />
                          <span className="hp-text">{hp} / {maxHP}</span>
                        </div>

                        {/* Shield bar */}
                        <div className="shield-bar">
                          <div className="shield-fill" style={{ width: `${shPct}%` }} />
                          <span className="shield-text">{shield} / {maxShield}</span>
                        </div>

                        {/* Cash */}
                        <div className="text-xs text-yellow-400 mt-1">
                          ${player.cashRemaining}
                        </div>

                        {/* Status badges */}
                        <div className="flex gap-1 mt-1 justify-center flex-wrap">
                          {player.agent && (
                            <span className="text-xs bg-blue-800 text-blue-200 px-1 rounded">Agent</span>
                          )}
                          {player.scientist > 0 && (
                            <span className="text-xs bg-purple-800 text-purple-200 px-1 rounded">
                              Sci ×{player.scientist}
                            </span>
                          )}
                          {!player.isActive && (
                            <span className="text-xs bg-red-900 text-red-300 px-1 rounded">Eliminated</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="right-container">
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

        {/* ── Dice ── */}
        <div
          className={`dice-container ${sharedRolling ? "rolling" : "pop"} ${!isMyTurn || actionModal ? "opacity-40 pointer-events-none" : ""}`}
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
};

export default Board;

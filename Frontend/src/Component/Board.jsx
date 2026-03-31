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
import emergencydefenceImg from "../assets/emergencydefence.png";
import moneyImg from "../assets/money.png"; // add if needed
import cyberImg from "../assets/cyber.png";
import taxImg from "../assets/tax.png";
import foreignImg from "../assets/foreign.png";
import supportersImg from "../assets/supporters.png";
import donationImg from "../assets/donation.png";
import curruptionImg from "../assets/curruption.png";
import cyberattackImg from "../assets/cyberattack.png";
import warmoneyImg from "../assets/warmoney.png";
import bribeworkImg from "../assets/bribework.png";
import bribecaughtImg from "../assets/bribecaught.png";
import strikeImg from "../assets/strike.png";
import droneImg from "../assets/drone.png";
// import { createPortal } from "react-dom";

const Board = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomId = new URLSearchParams(location.search).get("room");
  const game = location.state?.game || null;

  const socket = useRef(null);
  const audioRef = useRef(null);
  const stepAudio = useRef(null);
  const myUserIdRef = useRef(null);
  const currentTurnRef = useRef(game?.currentTurn || null);
  const optimisticPlayersRef = useRef([]);
  const hasEmittedPlayTurn = useRef(false);
  const bidTimerRef = useRef(null);

  const [myUserId, setMyUserId] = useState(null);
  const [players, setPlayers] = useState(game?.players || []);
  const [optimisticPlayers, setOptimisticPlayers] = useState(game?.players || []);
  const [currentTurn, setCurrentTurn] = useState(game?.currentTurn || null);
  const [turnNo, setTurnNo] = useState(game?.turnNo || 1);
  const [sharedRolling, setSharedRolling] = useState(false);
  const [sharedDiceValue, setSharedDiceValue] = useState(1);
  const [mysteryCase, setMysteryCase] = useState(null);
  const [gameOver, setGameOver] = useState(null);
  const [agentActivatedPlayer, setAgentActivatedPlayer] = useState(null);
  const [hitEffect, setHitEffect] = useState(false);

  // Buy modal — only the landing player sees this
  const [actionModal, setActionModal] = useState(null);
  // { card: { id, name, price }, playerCash }

  // Bid modal — ALL players see this
  const [bidModal, setBidModal] = useState(null);
  // { card: { id, name, price }, minBid, duration }
  const [bidAmount, setBidAmount] = useState("");
  const [bidTimeLeft, setBidTimeLeft] = useState(0);
  const [myBidSubmitted, setMyBidSubmitted] = useState(false);
  const [explodingTiles, setExplodingTiles] = useState([]);

  // Bid result toast
  const [bidResult, setBidResult] = useState(null);
  // { winnerName, amount, cardName }
  const [activeMystery, setActiveMystery] = useState(null);
  const { openCard } = useCardModal();
  const pawnImg = { redPawn, blackPawn, greenPawn, bluePawn, yellowPawn, whitePawn };

  const size = 9;
  const maxHP = 1500;
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
    "torpedo": torpedoIcon, "brahmos": brahmosIcon, "safe-zone": safeZoneIcon,
  };

  const tileLayouts = {
    1: [{ x: 0, y: 0, scale: 1 }],
    2: [{ x: -18, y: 0, scale: 0.85 }, { x: 18, y: 0, scale: 0.85 }],
    3: [{ x: 0, y: -18, scale: 0.8 }, { x: -18, y: 18, scale: 0.8 }, { x: 18, y: 18, scale: 0.8 }],
    4: [{ x: -18, y: -18, scale: 0.75 }, { x: 18, y: -18, scale: 0.75 }, { x: -18, y: 18, scale: 0.75 }, { x: 18, y: 18, scale: 0.75 }],
    5: [{ x: 0, y: -22, scale: 0.7 }, { x: -20, y: -5, scale: 0.7 }, { x: 20, y: -5, scale: 0.7 }, { x: -12, y: 18, scale: 0.7 }, { x: 12, y: 18, scale: 0.7 }],
    6: [{ x: -18, y: -18, scale: 0.65 }, { x: 18, y: -18, scale: 0.65 }, { x: -18, y: 0, scale: 0.65 }, { x: 18, y: 0, scale: 0.65 }, { x: -18, y: 18, scale: 0.65 }, { x: 18, y: 18, scale: 0.65 }],
  };

  const updateOptimisticPlayers = (val) => {
    optimisticPlayersRef.current = val;
    setOptimisticPlayers(val);
  };

  const getMysteryVisual = (statement) => {
    return mysteryVisuals[statement] || {
      image: mysteryIcon,
      color: "cyan",
    };
  };

  const mysteryVisuals = {
    "Emergency defence spending": {
      image: emergencydefenceImg,
      color: "red",
    },
    "Black Money Raid": {
      image: moneyImg,
      color: "gold",
    },
    "Cyber attack repair cost": {
      image: cyberImg,
      color: "purple",
    },
    "Tax from citizens": {
      image: taxImg,
      color: "gold",
    },
    "Foreign investment deal approved": {
      image: foreignImg,
      color: "purple",
    },
    "Received emergency funding from supporters": {
      image: supportersImg,
      color: "purple",
    },
    "Public rally success donation": {
      image: donationImg,
      color: "gold",
    },
    "Corruption investigation fine": {
      image: curruptionImg,
      color: "red",
    },
    "Printed War money": {
      image: warmoneyImg,
      color: "red",
    },
    "Bribe attempt works": {
      image: bribeworkImg,
      color: "green",
    },
    "Successful strike, looted enemy resources": {
      image: strikeImg,
      color: "purple",
    },
    "Defence Drone deployed": {
      image: droneImg,
      color: "red",
    },
  };

  const animateMove = (steps, movingIndex) =>
    new Promise((resolve) => {
      let step = 0;
      const interval = setInterval(() => {
        if (stepAudio.current) {
          stepAudio.current.currentTime = 0;
          stepAudio.current.play().catch(() => { });
        }
        updateOptimisticPlayers(
          optimisticPlayersRef.current.map((p, idx) =>
            idx === movingIndex ? { ...p, position: (p.position + 1) % border.length } : p
          )
        );
        step++;
        if (step >= steps) { clearInterval(interval); resolve(); }
      }, 320);
    });

  const clearBidState = () => {
    setBidModal(null);
    setMyBidSubmitted(false);
    setBidAmount("");
    if (bidTimerRef.current) clearInterval(bidTimerRef.current);
  };

  // ── Socket setup ────────────────────────────
  useEffect(() => {
    if (!game) return;

    socket.current = getSocket();
    if (!socket.current) return;

    audioRef.current = new Audio(diceAudio);
    audioRef.current.volume = 1.0;
    stepAudio.current = new Audio(pawnMoveSound);
    stepAudio.current.volume = 0.4;

    updateOptimisticPlayers(game.players);

    // identity
    socket.current.off("identity");
    socket.current.on("identity", ({ myUserId }) => {
      myUserIdRef.current = myUserId;
      setMyUserId(myUserId);
    });

    // Re-join room — also triggers identity emit from server
    socket.current.emit("joinLobby", { gameCode: roomId });

    // diceResult
    socket.current.off("diceResult");
    socket.current.on("diceResult", async ({ diceValue, rolledBy, players: updated }) => {
      setSharedDiceValue(diceValue);
      setSharedRolling(false);
      updateOptimisticPlayers(updated);

      const movingIndex = optimisticPlayersRef.current.findIndex(
        p => p.userId._id.toString() === rolledBy.toString()
      );
      if (movingIndex === -1) return;

      await animateMove(diceValue, movingIndex);

      if (rolledBy.toString() === myUserIdRef.current?.toString()) {
        if (hasEmittedPlayTurn.current) return;
        hasEmittedPlayTurn.current = true;
        socket.current.emit("playTurn", { gameCode: roomId });
      }
    });

    // turnResult — normal turn end
    socket.current.off("turnResult");
    socket.current.on("turnResult", ({ players: updated, currentTurn: nextTurn, turnNo: newTurnNo, mysteryCase: mc }) => {
      hasEmittedPlayTurn.current = false;
      setPlayers(updated);
      updateOptimisticPlayers(updated);
      setCurrentTurn(nextTurn);
      currentTurnRef.current = nextTurn;
      setTurnNo(newTurnNo);
      if (mc) {
        setActiveMystery(mc);

        setTimeout(() => {
          setActiveMystery(null);
        }, 6000); // duration of animation
      }
      setTimeout(() => setMysteryCase(null), 3500);
      setActionModal(null);
      clearBidState();

      const activeAgent = updated.find(p => p.agent === true);

      if (activeAgent) {
        // ✅ force new value every time
        setAgentActivatedPlayer(Date.now());

        // remove after 2 sec
        setTimeout(() => {
          setAgentActivatedPlayer(null);
        }, 2000);
      }
      const prevPlayers = optimisticPlayersRef.current;

      updated.forEach((p) => {
        const prev = prevPlayers.find(x => x.userId._id === p.userId._id);

        if (!prev) return;

        // 🔥 detect HP drop
        if (p.remainingParliamentHp < prev.remainingParliamentHp) {
          setHitEffect(true);

          setTimeout(() => setHitEffect(false), 800);
        }
      });

    });

    // boardUpdate — pawn moved but turn paused (buy/bid decision pending)
    socket.current.off("boardUpdate");
    socket.current.on("boardUpdate", ({ players: updated }) => {
      setPlayers(updated);
      updateOptimisticPlayers(updated);
    });

    socket.current.off("newPositions");
    socket.current.on("newPositions", ({ players: updated }) => {
      setPlayers(updated);
      updateOptimisticPlayers(updated);
    });

    // actionRequired — only landing player gets this
    // They choose: Buy (full price) OR Start Bid (open to everyone)
    socket.current.off("actionRequired");
    socket.current.on("actionRequired", ({ card, playerCash }) => {
      setActionModal({ card, playerCash });
    });

    // bidStarted — server broadcasts to ALL players when bid begins
    socket.current.off("bidStarted");
    socket.current.on("bidStarted", ({ card, minBid, duration }) => {
      setActionModal(null); // close buy modal for the landing player
      setMyBidSubmitted(false);
      setBidAmount(String(minBid));
      setBidModal({ card, minBid, duration });
      setBidTimeLeft(duration);

      if (bidTimerRef.current) clearInterval(bidTimerRef.current);
      bidTimerRef.current = setInterval(() => {
        setBidTimeLeft(prev => {
          if (prev <= 1) { clearInterval(bidTimerRef.current); return 0; }
          return prev - 1;
        });
      }, 1000);
    });

    // bidResult — server tells everyone who won
    socket.current.off("bidResult");
    socket.current.on("bidResult", ({ winnerName, amount, cardName, players: updated }) => {
      clearBidState();
      if (updated) { setPlayers(updated); updateOptimisticPlayers(updated); }
      setBidResult({ winnerName, amount, cardName });
      setTimeout(() => setBidResult(null), 3500);
    });

    // gameOver
    socket.current.off("gameOver");
    socket.current.on("gameOver", ({ winner, players: final }) => {
      setPlayers(final);
      updateOptimisticPlayers(final);
      setGameOver({ winner });
    });

    socket.current.off("timebombExploded");
    socket.current.on("timebombExploded", ({ position, casualties, nextBlastInTurns }) => {
      runTimeBombAnimation(position);
    });

    return () => {
      socket.current.off("identity");
      socket.current.off("diceResult");
      socket.current.off("turnResult");
      socket.current.off("boardUpdate");
      socket.current.off("actionRequired");
      socket.current.off("bidStarted");
      socket.current.off("bidResult");
      socket.current.off("gameOver");
      socket.current.off("timebombExploded");
      socket.current.off("newPositions");
      if (bidTimerRef.current) clearInterval(bidTimerRef.current);
    };
  }, []);

  const TOTAL_TILES = 32;

  const runTimeBombAnimation = async (center) => {
    const delays = [300, 400, 550, 700]; // increasing delay
    // Step 1 → center blast
    setExplodingTiles([center]);
    await new Promise(res => setTimeout(res, delays[0]));

    // Step 2 → pairs
    for (let step = 1; step <= 3; step++) {
      const pos1 = (center + step + TOTAL_TILES) % TOTAL_TILES;
      const pos2 = (center - step + TOTAL_TILES) % TOTAL_TILES;

      // BOTH explode together
      setExplodingTiles([pos1, pos2]);

      await new Promise(res => setTimeout(res, delays[step]));
    }

    // Clear after animation
    setTimeout(() => setExplodingTiles([]), 800);
  };


  const rollDice = () => {
    if (currentTurnRef.current?.toString() !== myUserIdRef.current?.toString()) return;
    if (sharedRolling || actionModal || bidModal) return;
    if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(() => { }); }
    setSharedRolling(true);
    socket.current.emit("rollDice", { gameCode: roomId });
  };

  // Direct buy — full price, no auction
  const handleBuy = () => {
    socket.current.emit("playerAction", { gameCode: roomId, action: "buy" });
    setActionModal(null);
    hasEmittedPlayTurn.current = false;
  };

  // Start bid — triggers bidStarted for all players
  const handleStartBid = () => {
    socket.current.emit("playerAction", { gameCode: roomId, action: "bid" });
    setActionModal(null);
    // bidStarted will open bid modal for everyone
  };

  // Submit bid amount during active auction
  const handleSubmitBid = () => {
    const amount = parseInt(bidAmount);
    if (!amount || amount < bidModal.minBid) return;
    const myPlayer = optimisticPlayers.find(p => p.userId._id?.toString() === myUserIdRef.current?.toString());
    if (!myPlayer || myPlayer.cashRemaining < amount) return;
    socket.current.emit("submitBid", { gameCode: roomId, amount });
    setMyBidSubmitted(true);
  };

  const isMyTurn = currentTurn?.toString() === myUserId?.toString();
  const myPlayer = optimisticPlayers.find(p => p.userId._id?.toString() === myUserId?.toString());


  const getPawnColor = (pawn) => {
    const map = {
      redPawn: "red",
      bluePawn: "blue",
      greenPawn: "green",
      yellowPawn: "yellow",
      blackPawn: "black",
      whitePawn: "white",
    };
    return map[pawn] || "#888";
  };
  const getDirectionClass = (i) => {
    const total = 32;

    if (i >= 0 && i < 8) return "top";      // bottom row
    if (i >= 8 && i < 16) return "left";       // left side
    if (i >= 16 && i < 24) return "top";       // top row
    return "right";                            // right side
  };

  return (
  
    <div className="hero2 min-h-screen bg-gradient-to-br from-indigo-950 to-black p-6">

      <CardModal socket={socket.current} roomId={roomId} myUserIdRef={myUserIdRef} currentTurnRef={currentTurnRef.current} />
      <GameChatContainer players={players} />
      {activeMystery && (
        <div className="mystery-overlay">
          <div className="mystery-card">
            <img
              src={getMysteryVisual(activeMystery.statement).image}
              className="mystery-img"
            />

            <h2 className="mystery-title">
              {activeMystery.statement}
            </h2>

            <p className="mystery-amount">
              {activeMystery.amount > 0 ? "+" : ""}
              {activeMystery.amount}
            </p>
          </div>
        </div>
            )}
      


      {/* ── Game Over ── */}
      {gameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-gray-900 border border-yellow-500 rounded-2xl p-10 text-center">
            <h2 className="text-4xl font-bold text-yellow-400 mb-4">Game Over</h2>
            <p className="text-white text-xl mb-6">
              Winner:{" "}
              {optimisticPlayers.find(p => p.userId._id?.toString() === gameOver.winner?.toString())?.userId?.username || "Unknown"}
            </p>
            <button className="px-6 py-2 bg-yellow-500 text-black rounded-xl font-bold" onClick={() => navigate("/dashboard")}>
              Back to Home
            </button>
          </div>
        </div>
      )}

      

      {
        agentActivatedPlayer &&
        <div className="agent-animated">
          Agent Card Activated
        </div>
      }

      {/* ── Buy / Start Bid Modal (landing player only) ── */}
      {actionModal && isMyTurn && (
        <div className="modal-overlay">
          <div className="buy-modal-premium">

            {/* Glow Background Effect */}
            <div className="modal-glow"></div>

            {/* Title */}
            <h3 className="modal-title">
              {actionModal.card.name}
            </h3>

            <p className="modal-subtext">Unowned Territory</p>

            {/* Price Section */}
            <div className="price-box">
              <span>Price</span>
              <h2>${actionModal.card.price}</h2>
            </div>

            {/* Player Cash */}
            <div className="cash-box">
              💰 ${actionModal.playerCash}
            </div>

            {/* Buttons */}
            <div className="modal-actions">
              {actionModal.playerCash >= actionModal.card.price && (
                <button className="buy-btn" onClick={handleBuy}>
                  Buy Now
                </button>
              )}

              <button className="bid-btn" onClick={handleStartBid}>
                🔨 Auction
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ── Bid Modal (ALL players) ── */}
      {bidModal && (
        <div className="bid-overlay">
          <div className="bid-modal-premium">

            {/* Header */}
            <div className="bid-header">
              <h3 className="bid-title"> {bidModal.card.name}</h3>
              <span className={`bid-timer ${bidTimeLeft <= 5 ? "danger" : ""}`}>
                {bidTimeLeft}s
              </span>
            </div>

            {/* Info */}
            <p className="bid-info">
              Min bid: <span className="highlight">${bidModal.minBid}</span>
              {" · "}
              Your cash: <span className="cash">${myPlayer?.cashRemaining ?? 0}</span>
            </p>

            {/* Input */}
            {!myBidSubmitted ? (
              <>
                <input
                  type="number"
                  min={bidModal.minBid}
                  max={myPlayer?.cashRemaining ?? 0}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="bid-input"
                  placeholder={`Min $${bidModal.minBid}`}
                />

                <div className="bid-actions">
                  <button
                    className="bid-btn-main"
                    disabled={
                      !bidAmount ||
                      Number(bidAmount) < bidModal.minBid ||
                      Number(bidAmount) > (myPlayer?.cashRemaining ?? 0)
                    }
                    onClick={handleSubmitBid}
                  >
                    Place Bid
                  </button>

                  <button
                    className="pass-btn"
                    onClick={() => setMyBidSubmitted(true)}
                  >
                    Pass
                  </button>
                </div>
              </>
            ) : (
              <p className="waiting-text">✅ Waiting for others...</p>
            )}

            {/* Players */}
            <div className="bid-players">
              <p className="players-title">Players:</p>

              {optimisticPlayers.filter(p => p.isActive).map((p, i) => (
                <div key={i} className="bid-player">
                  <span className="cash">{p.userId.username}</span>
                  <span className="cash">${p.cashRemaining}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ── Bid Result Toast ── */}
      {bidResult && (
        <div className="bid-result-toast">

          <div className="result-glow"></div>

          <p className="result-title">
            🏆 {bidResult.winnerName} won {bidResult.cardName}
          </p>

          <p className="result-amount">
            ${bidResult.amount}
          </p>

        </div>
      )}



      {/* ── Turn Indicator ── */}
      <div className="fixed top-4 right-4 z-20 bg-gray-900/90 border border-cyan-700 rounded-xl px-4 py-2 text-sm text-white">
        {isMyTurn ? <span className="text-green-400 font-bold">Your Turn</span> : <span className="text-gray-400">Waiting...</span>}
        <span className="ml-2 text-gray-500">Turn #{turnNo}</span>
      </div>

      {/* ── Board ── */}
      <div className="board-wrapper">
        <div className="bg-transparent p-6 rounded-3xl shadow-2xl">
          <div className="grid gap-2 bg-transparent p-4 rounded-2xl"
            style={{ gridTemplateColumns: `repeat(${size}, 90px)`, gridTemplateRows: `repeat(${size}, 70px)` }}
          >
            {border.map((cell, i) => {
              const tilePlayers = optimisticPlayers.filter(p => p.position === i);
              const layout = tileLayouts[Math.min(tilePlayers.length, 6)] || tileLayouts[6];
              const key = tileData[i].toLowerCase().replace(/\s+/g, "-");
              return (
                <div key={i}
                  className={`border-cell weapon-tile ${tileData[i].toLowerCase().replace(/\s+/g, '-')}  ${explodingTiles.includes(i) ? 'bomb-exploding' : ''}`}
                  style={{ gridRow: cell.r + 1, gridColumn: cell.c + 1 }}
                  onClick={() => openCard(cardMap[key], false, key)}
                >
                  <div className="ownership-container">
                    {optimisticPlayers.flatMap((player) =>
                      player.cards.map((cardObj, idx) => {
                        const card = cardObj.cardId;
                        if (!card) return null;

                        if (card.position === i) {
                          return (
                            <div
                              key={player.userId._id + idx}
                              className={`flag ${getDirectionClass(i)}`}
                            >
                              <div className="flag-pole"></div>
                              <div
                                className="flag-cloth"
                                style={{ backgroundColor: getPawnColor(player.pawn) }}
                              ></div>
                            </div>
                          );
                        }

                        return null;
                      })
                    )}
                  </div>
                  {tileIcons[key] && <img className="tile-icon" src={tileIcons[key]} alt={tileData[i]} />}
                  <div className="tile-label">{tileData[i]}</div>
                  {tilePlayers.map((player, idx) => {
                    const slot = layout[idx];
                    return (
                      <img key={player._id} src={pawnImg[player.pawn]} className="player-token"
                        style={{ transform: `translate(${slot.x}px, ${slot.y}px) scale(${slot.scale})` }}
                      />
                    );
                  })}
                </div>
              );
            })}

            {/* Center */}
            <div className="bg-transparent center-area backdrop-blur-sm rounded-2xl"
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
                    <div key={i} className={`player-cell ${hp <= 300 ? "low" : ""} ${isThisTurn ? "active-turn" : ""}`}>
                      <div className={`image-parent ${hitEffect ? "parliament-hit" : ""}`}>
                        <div className="name">
                          <span className={player.pawn}>{player.userId.username}</span>
                          {isThisTurn && <span className="text-xs text-green-400 ml-1">▶</span>}
                        </div>
                        <img src={logo} className="parl" alt={player.userId.username} />
                        <div className={`hp-bar ${hpPct <= 30 ? "low" : ""}`}>
                          <div className="hp-fill" style={{ width: `${hpPct}%` }} />
                          <span className="hp-text">{hp} / {maxHP}</span>
                        </div>
                        <div className="shield-bar">
                          <div className="shield-fill" style={{ width: `${shPct}%` }} />
                          <span className="shield-text">{shield} / {maxShield}</span>
                        </div>
                        <div className="money-scientist">
                          <div className="text-xs text-yellow-400 mt-1 money-tag cash-tag">${player.cashRemaining}</div>
                          <div className="money-tag sceintist-tag">scientist-card:{player.scientist}</div>
                        </div>
                        <div className="flex gap-1 mt-1 justify-center flex-wrap">
                          {player.agent && <span className="text-xs bg-blue-800 text-blue-200 px-1 rounded">Agent</span>}
                          {player.scientist > 0 && <span className="text-xs bg-purple-800 text-purple-200 px-1 rounded">Sci ×{player.scientist}</span>}
                          {!player.isActive && <span className="text-xs bg-red-900 text-red-300 px-1 rounded">Eliminated</span>}
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

      {/* Right Panel */}
      <div className="right-container">
        <div className="right-grid">
          {[
            { key: "emergency-meeting", img: emergency },
            { key: "wall-sena", img: wallSena },
            { key: "wall-maria", img: wallMaria },
            { key: "wall-rose", img: wallRose },
          ].map((item, i) => (
            <div key={i} className="right-cell" onClick={() => openCard(cardMap[item.key], true, item.key)}>
              <img src={item.img} alt={item.key} />
            </div>
          ))}
        </div>

        <div
          className={`dice-container ${sharedRolling ? "rolling" : "pop"} ${!isMyTurn || actionModal || bidModal ? "opacity-40 pointer-events-none" : ""}`}
          onClick={rollDice}
        >
          <div className="dice-display">
            <div className={`dice-face face-${sharedDiceValue}`}>
              {[...Array(9)].map((_, i) => <span key={i} className="pip" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  
    
  );
};

export default Board;
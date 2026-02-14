import React from 'react';
import "./Dashboard.css";
import { useEffect, useState } from 'react';
import accounting from "../assets/parliament.jpeg";
import { connectSocket } from "../Component/socket.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/api.js';

const DashBoard = () => {
    const { user } = useAuth();
    const [showFriendOption, setShowFriendOption] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [playerCount, setPlayerCount] = useState(2);

    const navigate = useNavigate();

    // generate random room code
    const generateRoomCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    // CREATE ROOM
    const handleCreateRoom = async () => {
        try {
            const roomCode = generateRoomCode();

            const res = await api.post("/friends/create", {
                maxPlayers: playerCount,
                gameCode: roomCode
            });

            if (!res.data.success) {
                alert("Room creation failed");
                return;
            }

            setShowCreateModal(false);
            setShowFriendOption(false);

            navigate(`/lobby?room=${roomCode}`);

        } catch (err) {
            alert("Something went wrong while creating room");
            console.log("Room creation error:", err);
        }
    };




    // JOIN ROOM (user will later enter code)
    const handleJoinRoom = () => {
        const socket = connectSocket();

        socket.once("connect", () => {
            navigate("/join-room"); // page where user types room code
        });
    };

    // useEffect(() => {
    //     const checkSession = async () => {
    //         const res = await fetch("http://localhost:3000/auth/me", {
    //             credentials: "include"
    //         });

    //         if (res.status === 200) {
    //             // session already exists
    //             connectSocket();
    //         } else {
    //             // create guest session
    //             await fetch("http://localhost:3000/auth/guest", {
    //                 credentials: "include"
    //             });
    //             connectSocket();
    //         }
    //     };

    //     checkSession();
    // }, []);

    // const handleOnlineMultiplayer =  () => {

    //     // 3. go to lobby
    //     navigate("/lobby");
    // };
    return (

        <div className='hero'>
            <div className='kuch'>
                <h1 className="logo-name">PARLIAMENT  BATTLEGROUND</h1>
                <h2 className="quote">Control The Flow Of Nation</h2>
            </div>
            <div className="top-user">
                👤 {user?.username}
            </div>
            {/* 
            <div>
                <img src={accounting} className="profile"></img>
            </div> */}

            <div className="glass-panel">
                <h2 className="panel-title ">GAME MODE</h2>

                <button className="glass-btn sharp-btn">🎮 Player VS Computer</button>
                <button className="glass-btn sharp-btn">🌐 Online Multiplayer</button>
                <button className="glass-btn sharp-btn" onClick={() => setShowFriendOption(true)}>👥 Play with Friends</button>
            </div>

            {showFriendOption && (
                <div className="friend-options">
                    <button onClick={() => setShowFriendOption(false)}>X</button>
                    <button onClick={() => { setShowCreateModal(true), setShowFriendOption(false) }}>Create Room</button>
                    <button onClick={handleJoinRoom}>Join Room</button>
                </div>
            )}

            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3>Create Room</h3>

                        <label>No. of Players</label>
                        <select
                            value={playerCount}
                            onChange={(e) => setPlayerCount(Number(e.target.value))}
                        >
                            {[2, 3, 4, 5, 6].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>

                        <div className="modal-actions">
                            <button onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button onClick={handleCreateRoom}>Create</button>
                        </div>
                    </div>
                </div>
            )}


            <div className="bottom-bar">
                <button className="nav-btn">⚙️<span>Settings</span></button>
                <button className="nav-btn">📩<span>Inbox</span></button>
                <button className="nav-btn">👥<span>Friends</span></button>
            </div>




            {/* <div className="glass-panel2">
                <h2 className="panel-title">Lobby</h2>
                <hr></hr>
                <div className="friend" >

                    <p> <button>+</button> Nihal <span>online</span>      </p>
                    <p> <button>+</button> Shlok  <span>online</span>     </p>
                    <p> <button>+</button> Tanmay  <span>online</span>    </p>
                    <p> <button>+</button> Dhangar <span>offline</span>    </p>
                </div>

            </div> */}

        </div>

    );
}

export default DashBoard;
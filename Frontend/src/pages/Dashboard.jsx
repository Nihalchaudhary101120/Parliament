import "./Dashboard.css";
import {  useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/api.js';
import { connectSocket } from "../Component/socket.js";


const DashBoard = () => {
    const { user, signout, setUsername } = useAuth();
    const [showFriendOption, setShowFriendOption] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [playerCount, setPlayerCount] = useState(2);

    //join states
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [joinError, setJoinError] = useState("");
    const [joining, setJoining] = useState(false);

    const navigate = useNavigate();

    const generateRoomCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    // CREATE ROOM
    const handleCreateRoom = async () => {
        try {
            const roomCode = generateRoomCode();

            const res = await api.post("/friends/create", {
                maxPlayer: playerCount,
                gameCode: roomCode
            });

            console.log(res);
            if (!res.data.success) {
                alert("Room creation failed");
                return;
            }

            connectSocket();
            setShowCreateModal(false);
            setShowFriendOption(false);

            navigate(`/lobby?room=${roomCode}`);

        } catch (err) {
            alert("Something went wrong while creating room");
            console.log("Room creation error:", err);
        }
    };

    // JOIN ROOM (user will later enter code)
    const handleJoinRoom = async () => {
        if (!joinCode.trim()) {
            setJoinError("Enter room code");
            return;
        }

        try {
            setJoining(true);
            setJoinError("");

            const res = await api.post("/friends/join", {
                gameCode: joinCode.trim().toUpperCase()
            });

            if (!res.data.success) {
                setJoinError("Failed to join room");
                return;
            }

            connectSocket();
            setShowJoinModal(false);
            setShowFriendOption(false);

            navigate(`/lobby?room=${joinCode.trim().toUpperCase()}`);

        } catch (err) {
            if (err.response?.data?.error) {
                setJoinError(err.response.data.error);
            } else {
                setJoinError("Something went wrong");
            }
        } finally {
            setJoining(false);
        }
    };

    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [settingUsername, setSettingUsername] = useState(false);

    const handleSetUsername = async () => {
        setUsernameError('');
        if (!newUsername.trim()) {
            setUsernameError('Enter a username');
            return;
        }
        setSettingUsername(true);
        const res = await setUsername(newUsername.trim());
        setSettingUsername(false);
        if (!res.success) {
            setUsernameError(res.error || 'Failed to set username');
            return;
        }
        setShowUsernameModal(false);
    };

    return (

        <div className='hero'>
            <div className='kuch'>
                <h1 className="logo-name">PARLIAMENT  BATTLEGROUND</h1>
                <h2 className="quote">Control The Flow Of Nation</h2>
            </div>
            <div className="top-user">
                <div className="user-line">👤 <strong>{user?.username || 'Guest'}</strong></div>
                <div className="user-actions">
                    {user && !user?.isGuest ? (
                        <button className="action-btn" onClick={() => setShowUsernameModal(true)}>
                            {user?.username ? 'Edit name' : 'Add username'}
                        </button>
                    ) : (
                        <button className="action-btn" onClick={() => navigate('/signup')}>Create account to set name</button>
                    )}
                    <button className="action-btn" onClick={signout}>Logout</button>
                </div>
            </div>

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
                    <button onClick={() => {
                        setShowJoinModal(true);
                        setShowFriendOption(false);
                    }}>
                        Join Room
                    </button>


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

            {showJoinModal && (
                <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3>Join Room</h3>

                        <label>Enter Room Code</label>
                        <input
                            type="text"
                            value={joinCode.trim().toUpperCase()}
                            onChange={(e) => setJoinCode(e.target.value.trim().toUpperCase())}
                            placeholder="Enter room code"
                        />

                        {joinError && <p className="error-text">{joinError}</p>}

                        <div className="modal-actions">
                            <button onClick={() => setShowJoinModal(false)}>Cancel</button>
                            <button onClick={handleJoinRoom} disabled={joining}>
                                {joining ? "Joining..." : "Join"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showUsernameModal && (
                <div className="modal-overlay" onClick={() => setShowUsernameModal(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3>{user?.username ? 'Edit username' : 'Add username'}</h3>

                        <label>Username</label>
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Enter username"
                        />

                        {usernameError && <p className="error-text">{usernameError}</p>}

                        <div className="modal-actions">
                            <button onClick={() => setShowUsernameModal(false)}>Cancel</button>
                            <button onClick={handleSetUsername} disabled={settingUsername}>
                                {settingUsername ? 'Saving...' : 'Save'}
                            </button>
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
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { connectSocket } from "./socket";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";          // ← add this import
import "./lobby.css";
import { FaWhatsapp } from "react-icons/fa";

export default function Lobby() {
    const navigate = useNavigate();
    const location = useLocation();

    const roomCode = new URLSearchParams(location.search).get("room");

    const [players, setPlayers] = useState([]);
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [status, setStatus] = useState("waiting");
    const [connectionError, setConnectionError] = useState("");
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        let cleanup = () => {};  // ← holds socket cleanup

        const joinAndConnect = async () => {
            if (!roomCode) {
                setConnectionError("Room code missing");
                return;
            }

            // Step 1: Add player to game via REST API
            try {
                const res = await api.post('/friends/join', { gameCode: roomCode });
                if (!res.data.success) {
                    setConnectionError(res.data.error || "Failed to join room");
                    return;
                }
            } catch (err) {
                setConnectionError(err?.response?.data?.error || "Failed to join room");
                return;
            }

            // Step 2: Connect socket
            const socket = connectSocket(user);
            if (!socket) {
                setConnectionError("Connection failed");
                return;
            }

            const joinLobby = () => {
                console.log("Joining lobby:", roomCode);
                socket.emit("joinLobby", { gameCode: roomCode }, (response) => {
                    if (response?.error) {
                        setConnectionError(response.error);
                    }
                });
            };

            const handleError = () => setConnectionError("Connection error occurred");
            const handleDisconnect = (reason) => {
                if (reason === 'io server disconnect') setConnectionError("Disconnected by server");
            };

            socket.on("connect_error", handleError);
            socket.on("disconnect", handleDisconnect);

            if (socket.connected) {
                joinLobby();
            } else {
                socket.once("connect", joinLobby);
            }

            socket.on("lobbyUpdate", (data) => {
                console.log("Lobby Update Received:", data);
                setPlayers(data.players);
                setMaxPlayers(data.maxPlayer);
                setStatus(data.status);
                setConnectionError("");

                if (data.status === "active") {
                    navigate(`/game?room=${roomCode}`, { state: { game: data.game } });
                }
            });

            socket.on("gameStart", ({ game }) => {
                navigate(`/game?room=${roomCode}`, { state: { game } });
            });

            socket.on("lobbyError", (data) => {
                setConnectionError(data.message || "Lobby error occurred");
            });

            // Save cleanup for when effect unmounts
            cleanup = () => {
                socket.off("lobbyUpdate");
                socket.off("gameStart");
                socket.off("lobbyError");
                socket.off("connect_error", handleError);
                socket.off("disconnect", handleDisconnect);
            };
        };

        joinAndConnect();

        return () => cleanup();  // ← cleanup runs on unmount

    }, [roomCode, user]);

    const [copied, setCopied] = useState(false);

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(roomCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 5000);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    const shareLobby = async () => {
        const inviteLink = `${window.location.origin}/lobby?room=${roomCode}`;
        if (navigator.share) {
            await navigator.share({
                title: "Join my Parliament Game",
                text: "Join my game room!",
                url: inviteLink
            });
        } else {
            await navigator.clipboard.writeText(inviteLink);
            alert("Invite link copied!");
        }
    };

    const shareWhatsapp = () => {
        const inviteLink = `${window.location.origin}/lobby?room=${roomCode}`;
        const text = `Join my Parliament game!\n${inviteLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <div className="lobby-container">
            <h2>Lobby</h2>

            {connectionError && (
                <div style={{
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    textAlign: 'center'
                }}>
                    Connection Error: {connectionError}
                </div>
            )}

            <div className="room-box">
                <p><strong>Room Code:</strong> {roomCode}</p>
                <div className="whatsapp">
                    <button onClick={copyCode} className={`copy-btn ${copied ? "copied" : ""}`}>
                        {copied ? "Copied ✓" : "Copy Invite Code"}
                    </button>
                    <button onClick={shareLobby}>Share Lobby</button>
                    <button className="whatsapp-btn" onClick={shareWhatsapp}>
                        <FaWhatsapp size={24} />
                        Share on WhatsApp
                    </button>
                </div>
            </div>

            <div className="player-list">
                <h3>Players ({players.length}/{maxPlayers})</h3>
                {players.map((p, index) => (
                    <div key={index} className="player-item">
                        {p.userId?.username || "Player"}
                    </div>
                ))}
            </div>

            {status === "waiting" && (
                <p className="waiting-text">Waiting for players...</p>
            )}
        </div>
    );
}
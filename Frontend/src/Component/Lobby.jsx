import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSocket, connectSocket } from "./socket";
import "./lobby.css";

export default function Lobby() {
    const navigate = useNavigate();
    const location = useLocation();

    const roomCode = new URLSearchParams(location.search).get("room");

    const [players, setPlayers] = useState([]);
    const [maxPlayers, setMaxPlayers] = useState(0);
    const [status, setStatus] = useState("waiting");

    useEffect(() => {
        const socket = connectSocket();
        if (!socket) {
            console.log("Socket  missing");
            return;
        }

        if (!roomCode) {
            console.log("roomcode not found");
            return;
        }

        const joinLobby = () => {
            console.log("Joining lobby:", roomCode);
            socket.emit("joinLobby", { gameCode: roomCode });
        };

        if (socket.connected) {
            joinLobby();
        } else {
            socket.once("connect", joinLobby);
        }
        // console.log("Joining lobby:", roomCode);
        // socket.emit("joinLobby", { gameCode: roomCode });

        socket.on("lobbyUpdate", (data) => {
            console.log("Lobby Update Received:", data);
            setPlayers(data.players);
            setMaxPlayers(data.maxPlayer);
            setStatus(data.status);
        });

        socket.on("gameStart", ({gameId , players , myUserId}) => {
            console.log("Game started");
            gameId:gameId;
            players:players
            navigate(`/game?room=${roomCode}` , {
                state:{
                    players , gameId , myUserId
                    
                }
            });
        });

        return () => {
            socket.off("lobbyUpdate");
            socket.off("gameStart");
        };

    }, [roomCode]);

    const copyLink = () => {
        const link = `${window.location.origin}/join?code=${roomCode}`;
        navigator.clipboard.writeText(link);
        alert("Invite link copied!");
    };

    return (
        <div className="lobby-container">

            <h2>Lobby</h2>

            <div className="room-box">
                <p><strong>Room Code:</strong> {roomCode}</p>
                <button onClick={copyLink}>Copy Invite Link</button>
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

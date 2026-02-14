import { useEffect } from "react";
import { getSocket } from "./socket";

export default function Lobby() {
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;


        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
            socket.emit("joinChat", { roomId: "game-room-1" });
        });

        socket.on("receiveMessage", (msg) => {
            console.log("Message received:", msg);
        });

    }, []);

    return <h2>Socket Test Running</h2>;
}

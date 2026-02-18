import { useEffect, useState } from "react";
import GameChat from "./GameChat.jsx";
import { useLocation } from "react-router-dom";
import { getSocket } from "./socket";




export default function GameChatContainer() {
  const [messages, setMessages] = useState([]);

  const location = useLocation();
  const roomId = new URLSearchParams(location.search).get("room");
  useEffect(() => {
    const socket = getSocket();
    console.log("socket and roomId", socket, roomId);
    if (!roomId || !socket) return;


    // const joinRoom = () => {
    //   console.log("Emitting joinChat:", roomId);
    //   socket.emit("joinChat", { roomId });
    // };

    // if (socket.connected) {
    //   joinRoom();
    // } else {
    //   socket.once("connect", joinRoom);
    // }
    socket.off("receiveMessage");
    socket.on("receiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId]);

  const addMessage = (sender, content, type) => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit("sendMessage", {
      roomId,
      message: content,
      type
    });
  };
console.log("Container addMessage:", addMessage);


  return (
    <GameChat
      messages={messages}
      addMessage={addMessage}
    />
  );
}

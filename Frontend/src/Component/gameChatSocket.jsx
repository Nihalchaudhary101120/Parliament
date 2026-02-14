import { useEffect, useState } from "react";
import GameChat from "./GameChat";
import { getSocket } from "./socket";

const socket = getSocket();


export default function GameChatContainer() {
  const [messages, setMessages] = useState([]);
  const roomId = "game-room-1";

  useEffect(() => {
    socket.emit("joinChat", { roomId });

    socket.on("receiveMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const addMessage = (sender, content, type) => {
    socket.emit("sendMessage", {
      
      roomId,
      message: content,
      
    });
  };

  return (
    <GameChat
      messages={messages}
      addMessage={addMessage}
    />
  );
}



  export default function chatSocket(io, socket) {
    const user = socket.request.session.user;

    // socket.on("joinChat", ({ roomId }) => {
    //   socket.join(roomId);
    //   console.log("gameRoomId",roomId);

    //   io.to(roomId).emit("receiveMessage", {
    //     id: Date.now(),
    //     sender: "System",
    //     content: `${user.username} joined the chat`,
    //     type: "system",
    //     time: new Date().toLocaleTimeString()
    //   });
    // });

    socket.on("sendMessage", ({ roomId, message ,type="user"}) => {
      io.to(roomId).emit("receiveMessage", {
        id: Date.now(),
        sender:type === "system" ? "System" : user.username,
        content: message,
        type:"user",
        time: new Date().toLocaleTimeString()
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", user.username);
    });
  }


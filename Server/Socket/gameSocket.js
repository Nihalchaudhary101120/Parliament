import Game from "../models/GameSession.js";

export default function gameSocket(io, socket) {
  const user = socket.request.session.user;

  socket.on("joinLobby", async ({ gameCode }) => {
    try {
      const game = await Game.findOne({ gameCode }).populate("players.userId");
      if (!game) {
        socket.emit("lobbyError", { message: "Game not found" });
        return;
      }

      socket.join(gameCode);

      io.to(gameCode).emit("lobbyUpdate", {
        players: game.players,
        maxPlayer: game.maxPlayer,
        status: game.status
      });

      if (game.status === "active") {
        io.to(gameCode).emit("gameStart", {
          gameId: game._id
        });
      }
    } catch (err) {
      console.error("joinLobby error:", err);
      socket.emit("lobbyError", { message: "Unable to join lobby" });
    }
  });

  socket.on("disconnect", () => {
    // optional: emit leave notifications or cleanup
    console.log(`User ${user?.username} disconnected from game sockets`);
  });
}

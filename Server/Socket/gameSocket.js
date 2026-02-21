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
      console.log("The game code :", gameCode);

      io.to(gameCode).emit("lobbyUpdate", {
        players: game.players,
        maxPlayer: game.maxPlayer,
        status: game.status

      });

      console.log(game.players);


      if (game.status === "active") {
        io.to(gameCode).emit("gameStart", {
          gameId: game._id,
          players: game.players,
          myUserId: user.id
        });
        console.log("myuserid:", user.id);

      }
    } catch (err) {
      console.error("joinLobby error:", err);
      socket.emit("lobbyError", { message: "Unable to join lobby" });
    }
  });

  socket.on("rollDice", async ({ gameCode, diceValue }) => {
    const game = await Game.findOne({ gameCode });
    if (!game || game.status !== "active") return;

    const userId = socket.request.session.user.id;

    if (game.currentTurn.toString() !== userId.toString()) {
      return socket.emit("errorMsg", "Not your turn");
    }

    const idx = game.players.findIndex(
      p => p.userId.toString() === userId.toString()
    );

    game.players[idx].position =
      (game.players[idx].position + diceValue) % 32;

    // Advance turn + round
    const nextIndex = (idx + 1) % game.players.length;

    if (nextIndex === 0) {
      game.turnNo += 1;
    }

    game.currentTurn = game.players[nextIndex].userId;

    await game.save();

    io.to(gameCode).emit("authoritativeUpdate", {
      players: game.players,
      currentTurn: game.currentTurn,
      turnNo: game.turnNo
    });

    io.to(gameCode).emit("diceResult", {
      diceValue,
    });
  });

  socket.on("diceRolling", ({ roomId }) => {
    io.to(roomId).emit("diceRolling");
  }

  
);

  


  socket.on("disconnect", () => {
    // optional: emit leave notifications or cleanup
    console.log(`User ${user?.username} disconnected from game sockets`);
  });
}

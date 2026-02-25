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
          game: game
        });


        // console.log("myuserid:", user.id);

      }
    } catch (err) {
      console.error("joinLobby error:", err);
      socket.emit("lobbyError", { message: "Unable to join lobby" });
    }
  });

  socket.on("requestMyIdentity", () => {
    socket.emit("myUserIdentity", {
      myUserId: user.id
    });
  });


  socket.on("rollDice", async ({ gameCode }) => {
    const game = await Game.findOne({ gameCode });
    if (!game || game.status !== "active") return;

    const userId = socket.request.session.user.id;

    if (game.currentTurn.toString() !== userId.toString()) {
      return socket.emit("errorMsg", "Not your turn");
    }

    io.to(gameCode).emit("diceRolling");

    // 2️⃣ backend decides dice ONCE
    const diceValue = Math.floor(Math.random() * 6) + 1;
    setTimeout(async () => {
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

      await game.populate("players.userId");

      io.to(gameCode).emit("diceResult", {
        players: game.players,
        previousTurn: userId,
        currentTurn: game.currentTurn,
        turnNo: game.turnNo,
        diceValue,
      });

      io.to(gameCode).emit("receiveMessage", {
        id: Date.now(),
        sender: "System",
        content: `${user.username} rolled ${diceValue}`,
        type: "system",
        time: new Date().toLocaleTimeString()
      });

    }, 700);
  });


  socket.on("disconnect", () => {
    // optional: emit leave notifications or cleanup
    console.log(`User ${user?.username} disconnected from game sockets`);
  });
}

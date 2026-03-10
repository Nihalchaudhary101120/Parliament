import Game from "../models/GameSession.js";
import Card from "../models/cards.js";


function getMysteryCard() {
  const MysteryBox = [
    { amount: +150, statement: "Foreign investment deal approaved" },
    { amount: +100, statement: "Tax from citizens" },
    { amount: +110, statement: "Black Money Raid" },
    { amount: +130, statement: "Received emergency funding from supporters" },
    { amount: +101, statement: "Public rally success donation" },
    { amount: -100, statement: "Curruption investigation fine" },
    { amount: -90, statement: "Emergency defence spending" },
    { amount: -120, statement: "Cyber attack repair cost" },
    { amount: +50, statement: "Printed War money" },
    { amount: +100, statement: "Bribe attempt works" },
    { amount: -100, statement: "Bribe attempt caught" },
    { amount: +100, statement: "Successful strike, looted enemy resources" },
    { amount: -100, statement: "Defence Drone deployed" }
  ];

  const rand = Math.floor(Math.random() * MysteryBox.length);
  return MysteryBox[rand];
}

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
   console.log("rollDice received from:", socket.id, "gameCode:", gameCode);

    const game = await Game.findOne({ gameCode });
    if (!game || game.status !== "active") return;

    const userId = socket.request.session?.user?.id;

    if (game.currentTurn.toString() !== userId.toString()) {
      return socket.emit("errorMsg", "Not your turn");
    }

    io.to(gameCode).emit("diceRolling");

    // 2️⃣ backend decides dice ONCE
    const diceValue = Math.floor(Math.random() * 6) + 1;
    setTimeout(async () => {
      // const idx = game.players.findIndex(
      //   p => p.userId.toString() === userId.toString()
      // );

      // game.players[idx].position =
      //   (game.players[idx].position + diceValue) % 32;

      // // Advance turn + round
      // const nextIndex = (idx + 1) % game.players.length;

      // if (nextIndex === 0) {
      //   game.turnNo += 1;
      // }

      // game.currentTurn = game.players[nextIndex].userId;

      // await game.save();

      // await game.populate("players.userId");
      console.log("diceResult emitted", diceValue);

      io.to(gameCode).emit("diceResult", {
        // players: game.players,
        previousTurn: userId,
        // currentTurn: game.currentTurn,
        // turnNo: game.turnNo,
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


  socket.on("playTurn", async ({ gameCode, dice, chanceSkipped }) => {

    const userId = socket.request.session.user.id;

    const game = await Game.findOne({ gameCode });

    if (!game || game.status !== "active") {
      return socket.emit("errorMsg", "Game not active");
    }

    if (game.currentTurn.toString() !== userId.toString()) {
      return socket.emit("errorMsg", "Not your turn");
    }

    game.turnNo += 1;

    const player = game.players.find(p =>
      p.userId.toString() === userId.toString()
    );

    if (chanceSkipped) player.skippedChances++;

    if (player.skippedChances === 4) {
      player.isActive = false;
    }

    const currentIndex = game.players.findIndex(p =>
      p.userId.toString() === userId.toString()
    );

    let nextIndex = (currentIndex + 1) % game.players.length;

    while (!game.players[nextIndex].isActive) {
      nextIndex = (nextIndex + 1) % game.players.length;
    }

    if (currentIndex === nextIndex) {
      game.status = "finished";
      game.winner = userId;
    }

    player.position = (player.position + dice) % 32;

    const card = await Card.findOne({ position: player.position });

    let purchased = false;
    let ownerOfCard = "";
    let shieldDamage = 0;
    let mysteryCase = {};

    const getOwnerPlayerById = (game, ownerId) => {
      return game.players.find(p => p.userId.toString() === ownerId.toString());
    };

    let scientistDamage = 0;
    let agentDamage = 0;
    let scientistQty = 0;
    const hasAgent = player.agent;

    switch (card.category) {

      case "public":
        player.remainingParliamentHp -= card.weaponDamage;
        player.remainingShieldHp -= card.weaponDamage;

        if (player.remainingShieldHp < 0)
          player.remainingShieldHp = 0;

        player.agent = false;
        break;

      case "weapon":

        if (card.isPurchasable) {

          for (let p of game.players) {

            ownerOfCard = p.userId;

            scientistQty =
              getOwnerPlayerById(game, ownerOfCard)?.scientist || 0;

            for (let c of p.cards) {
              if (c.cardId.toString() === card._id.toString()) {
                purchased = true;
                break;
              }
            }

            if (purchased) break;
          }

          scientistDamage =
            card.weaponDamage + card.weaponDamage * scientistQty * 0.03;

          agentDamage = hasAgent
            ? scientistDamage / 2
            : scientistDamage;

          if (purchased) {

            if (ownerOfCard.toString() !== userId.toString()) {

              if (player.remainingShieldHp >= agentDamage) {
                player.remainingShieldHp -= agentDamage;

              } else if (player.remainingShieldHp > 0) {

                shieldDamage =
                  player.remainingShieldHp - agentDamage;

                player.remainingShieldHp = 0;
                player.remainingParliamentHp += shieldDamage;

              } else {
                player.remainingParliamentHp -= agentDamage;
              }
            }

          } else {

            if (player.cashRemaining < card.price) {

              const bidders = game.players
                .filter(p => p.isActive && p.cashRemaining > 0)
                .map(p => ({
                  userId: p.userId,
                  cash: p.cashRemaining
                }));

              return io.to(gameCode).emit("bidStarted", {
                card: {
                  id: card._id,
                  name: card.name,
                  price: card.price
                },
                bidders
              });

            } else {

              return socket.emit("actionRequired", {
                options: ["buy", "bid"],
                card: {
                  id: card._id,
                  name: card.name,
                  price: card.price
                }
              });

            }
          }
        }

        player.agent = false;
        break;

      case "terror":
        player.cashRemaining -= card.price;
        player.agent = false;
        break;

      case "safe":
        player.agent = false;
        break;

      case "start":
        player.cashRemaining += 200;
        player.agent = false;
        break;

      case "mystery":
        mysteryCase = getMysteryCard();
        player.cashRemaining += mysteryCase.amount;
        player.agent = false;
        break;

      case "agent":
        player.agent = true;
        break;

      case "scientist":
        player.scientist += 1;
        player.agent = false;
        break;

      case "engineer":

        player.remainingParliamentHp += 100;

        if (player.remainingParliamentHp > 1000)
          player.remainingParliamentHp = 1000;

        player.agent = false;
        break;

      default:
        throw new Error("Unknown card category");
    }

    if (player.remainingParliamentHp <= 0) {
      player.isActive = false;
    }

    await game.save();

    await game.populate("players.userId");

    io.to(gameCode).emit("turnResult", {
      players: game.players,
      mysteryCase,
      currentTurn: game.players[nextIndex].userId._id,
      turnNo: game.turnNo
    });

  });

  socket.on("disconnect", () => {
    // optional: emit leave notifications or cleanup
    console.log(`User ${user?.username} disconnected from game sockets`);
  });
}

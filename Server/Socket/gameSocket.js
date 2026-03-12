// import Game from "../models/GameSession.js";
// import Card from "../models/cards.js";


// function getMysteryCard() {
//   const MysteryBox = [
//     { amount: +150, statement: "Foreign investment deal approaved" },
//     { amount: +100, statement: "Tax from citizens" },
//     { amount: +110, statement: "Black Money Raid" },
//     { amount: +130, statement: "Received emergency funding from supporters" },
//     { amount: +101, statement: "Public rally success donation" },
//     { amount: -100, statement: "Curruption investigation fine" },
//     { amount: -90, statement: "Emergency defence spending" },
//     { amount: -120, statement: "Cyber attack repair cost" },
//     { amount: +50, statement: "Printed War money" },
//     { amount: +100, statement: "Bribe attempt works" },
//     { amount: -100, statement: "Bribe attempt caught" },
//     { amount: +100, statement: "Successful strike, looted enemy resources" },
//     { amount: -100, statement: "Defence Drone deployed" }
//   ];

//   const rand = Math.floor(Math.random() * MysteryBox.length);
//   return MysteryBox[rand];
// }

// export default function gameSocket(io, socket) {
//   const user = socket.request.session.user;

//   socket.on("joinLobby", async ({ gameCode }) => {
//     try {
//       const game = await Game.findOne({ gameCode }).populate("players.userId");
//       if (!game) {
//         socket.emit("lobbyError", { message: "Game not found" });
//         return;
//       }

//       socket.join(gameCode);
//       console.log("The game code :", gameCode);

//       io.to(gameCode).emit("lobbyUpdate", {
//         players: game.players,
//         maxPlayer: game.maxPlayer,
//         status: game.status

//       });

//       console.log(game.players);


//       if (game.status === "active") {
//         io.to(gameCode).emit("gameStart", {
//           gameId: game._id,
//           players: game.players,
//           game: game
//         });


//         // console.log("myuserid:", user.id);

//       }
//     } catch (err) {
//       console.error("joinLobby error:", err);
//       socket.emit("lobbyError", { message: "Unable to join lobby" });
//     }
//   });

//   socket.on("requestMyIdentity", () => {
//     socket.emit("myUserIdentity", {
//       myUserId: user.id
//     });
//   });


//   socket.on("rollDice", async ({ gameCode }) => {
//    console.log("rollDice received from:", socket.id, "gameCode:", gameCode);

//     const game = await Game.findOne({ gameCode });
//     if (!game || game.status !== "active") return;

//     const userId = socket.request.session?.user?.id;

//     if (game.currentTurn.toString() !== userId.toString()) {
//       return socket.emit("errorMsg", "Not your turn");
//     }

//     io.to(gameCode).emit("diceRolling");

//     // 2️⃣ backend decides dice ONCE
//     const diceValue = Math.floor(Math.random() * 6) + 1;
//     setTimeout(async () => {
//       // const idx = game.players.findIndex(
//       //   p => p.userId.toString() === userId.toString()
//       // );

//       // game.players[idx].position =
//       //   (game.players[idx].position + diceValue) % 32;

//       // // Advance turn + round
//       // const nextIndex = (idx + 1) % game.players.length;

//       // if (nextIndex === 0) {
//       //   game.turnNo += 1;
//       // }

//       // game.currentTurn = game.players[nextIndex].userId;

//       // await game.save();

//       // await game.populate("players.userId");
//       console.log("diceResult emitted", diceValue);

//       io.to(gameCode).emit("diceResult", {
//         // players: game.players,
//         previousTurn: userId,
//         // currentTurn: game.currentTurn,
//         // turnNo: game.turnNo,
//         diceValue,
//       });

//       io.to(gameCode).emit("receiveMessage", {
//         id: Date.now(),
//         sender: "System",
//         content: `${user.username} rolled ${diceValue}`,
//         type: "system",
//         time: new Date().toLocaleTimeString()
//       });

//     }, 700);
//   });


//   socket.on("playTurn", async ({ gameCode, dice, chanceSkipped }) => {

//     const userId = socket.request.session.user.id;

//     const game = await Game.findOne({ gameCode });

//     if (!game || game.status !== "active") {
//       return socket.emit("errorMsg", "Game not active");
//     }

//     if (game.currentTurn.toString() !== userId.toString()) {
//       return socket.emit("errorMsg", "Not your turn");
//     }

//     game.turnNo += 1;

//     const player = game.players.find(p =>
//       p.userId.toString() === userId.toString()
//     );

//     if (chanceSkipped) player.skippedChances++;

//     if (player.skippedChances === 4) {
//       player.isActive = false;
//     }

//     const currentIndex = game.players.findIndex(p =>
//       p.userId.toString() === userId.toString()
//     );

//     let nextIndex = (currentIndex + 1) % game.players.length;

//     while (!game.players[nextIndex].isActive) {
//       nextIndex = (nextIndex + 1) % game.players.length;
//     }

//     if (currentIndex === nextIndex) {
//       game.status = "finished";
//       game.winner = userId;
//     }

//     player.position = (player.position + dice) % 32;

//     const card = await Card.findOne({ position: player.position });

//     let purchased = false;
//     let ownerOfCard = "";
//     let shieldDamage = 0;
//     let mysteryCase = {};

//     const getOwnerPlayerById = (game, ownerId) => {
//       return game.players.find(p => p.userId.toString() === ownerId.toString());
//     };

//     let scientistDamage = 0;
//     let agentDamage = 0;
//     let scientistQty = 0;
//     const hasAgent = player.agent;

//     switch (card.category) {

//       case "public":
//         player.remainingParliamentHp -= card.weaponDamage;
//         player.remainingShieldHp -= card.weaponDamage;

//         if (player.remainingShieldHp < 0)
//           player.remainingShieldHp = 0;

//         player.agent = false;
//         break;

//       case "weapon":

//         if (card.isPurchasable) {

//           for (let p of game.players) {

//             ownerOfCard = p.userId;

//             scientistQty =
//               getOwnerPlayerById(game, ownerOfCard)?.scientist || 0;

//             for (let c of p.cards) {
//               if (c.cardId.toString() === card._id.toString()) {
//                 purchased = true;
//                 break;
//               }
//             }

//             if (purchased) break;
//           }

//           scientistDamage =
//             card.weaponDamage + card.weaponDamage * scientistQty * 0.03;

//           agentDamage = hasAgent
//             ? scientistDamage / 2
//             : scientistDamage;

//           if (purchased) {

//             if (ownerOfCard.toString() !== userId.toString()) {

//               if (player.remainingShieldHp >= agentDamage) {
//                 player.remainingShieldHp -= agentDamage;

//               } else if (player.remainingShieldHp > 0) {

//                 shieldDamage =
//                   player.remainingShieldHp - agentDamage;

//                 player.remainingShieldHp = 0;
//                 player.remainingParliamentHp += shieldDamage;

//               } else {
//                 player.remainingParliamentHp -= agentDamage;
//               }
//             }

//           } else {

//             if (player.cashRemaining < card.price) {

//               const bidders = game.players
//                 .filter(p => p.isActive && p.cashRemaining > 0)
//                 .map(p => ({
//                   userId: p.userId,
//                   cash: p.cashRemaining
//                 }));

//               return io.to(gameCode).emit("bidStarted", {
//                 card: {
//                   id: card._id,
//                   name: card.name,
//                   price: card.price
//                 },
//                 bidders
//               });

//             } else {

//               return socket.emit("actionRequired", {
//                 options: ["buy", "bid"],
//                 card: {
//                   id: card._id,
//                   name: card.name,
//                   price: card.price
//                 }
//               });

//             }
//           }
//         }

//         player.agent = false;
//         break;

//       case "terror":
//         player.cashRemaining -= card.price;
//         player.agent = false;
//         break;

//       case "safe":
//         player.agent = false;
//         break;

//       case "start":
//         player.cashRemaining += 200;
//         player.agent = false;
//         break;

//       case "mystery":
//         mysteryCase = getMysteryCard();
//         player.cashRemaining += mysteryCase.amount;
//         player.agent = false;
//         break;

//       case "agent":
//         player.agent = true;
//         break;

//       case "scientist":
//         player.scientist += 1;
//         player.agent = false;
//         break;

//       case "engineer":

//         player.remainingParliamentHp += 100;

//         if (player.remainingParliamentHp > 1000)
//           player.remainingParliamentHp = 1000;

//         player.agent = false;
//         break;

//       default:
//         throw new Error("Unknown card category");
//     }

//     if (player.remainingParliamentHp <= 0) {
//       player.isActive = false;
//     }

//     await game.save();

//     await game.populate("players.userId");

//     io.to(gameCode).emit("turnResult", {
//       players: game.players,
//       mysteryCase,
//       currentTurn: game.players[nextIndex].userId._id,
//       turnNo: game.turnNo
//     });

//   });

//   socket.on("disconnect", () => {
//     // optional: emit leave notifications or cleanup
//     console.log(`User ${user?.username} disconnected from game sockets`);
//   });
// }



import Game from "../models/GameSession.js";
import Card from "../models/cards.js";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function getMysteryCard() {
  const MysteryBox = [
    { amount: +150, statement: "Foreign investment deal approved" },
    { amount: +100, statement: "Tax from citizens" },
    { amount: +110, statement: "Black Money Raid" },
    { amount: +130, statement: "Received emergency funding from supporters" },
    { amount: +101, statement: "Public rally success donation" },
    { amount: -100, statement: "Corruption investigation fine" },
    { amount: -90, statement: "Emergency defence spending" },
    { amount: -120, statement: "Cyber attack repair cost" },
    { amount: +50, statement: "Printed War money" },
    { amount: +100, statement: "Bribe attempt works" },
    { amount: -100, statement: "Bribe attempt caught" },
    { amount: +100, statement: "Successful strike, looted enemy resources" },
    { amount: -100, statement: "Defence Drone deployed" },
  ];
  return MysteryBox[Math.floor(Math.random() * MysteryBox.length)];
}

function applyDamage(player, dmg) {
  dmg = Math.floor(dmg);
  if (player.remainingShieldHp >= dmg) {
    player.remainingShieldHp -= dmg;
  } else {
    const overflow = dmg - player.remainingShieldHp;
    player.remainingShieldHp = 0;
    player.remainingParliamentHp -= overflow;
  }
  if (player.remainingParliamentHp < 0) player.remainingParliamentHp = 0;
}

function applyPublicDamage(player, dmg) {
  dmg = Math.floor(dmg);
  player.remainingShieldHp -= dmg;
  player.remainingParliamentHp -= dmg;
  if (player.remainingShieldHp < 0) player.remainingShieldHp = 0;
  if (player.remainingParliamentHp < 0) player.remainingParliamentHp = 0;
}

function findCardOwner(game, cardId) {
  for (const p of game.players) {
    const owns = p.cards.some(c => c.cardId.toString() === cardId.toString());
    if (owns) return p;
  }
  return null;
}

function getNextActiveIndex(game, currentIndex) {
  const total = game.players.length;
  let nextIndex = (currentIndex + 1) % total;
  let loops = 0;

  while (!game.players[nextIndex].isActive) {
    nextIndex = (nextIndex + 1) % total;
    loops++;
    // If looped all the way around, no active players left
    if (loops >= total) return -1;
  }
  return nextIndex;
}

// ─────────────────────────────────────────────
// MAIN SOCKET HANDLER
// ─────────────────────────────────────────────

export default function gameSocket(io, socket) {

  // userId is attached by middleware — never read from session here
  const userId = socket.userId;
  const username = socket.username;

  if (!userId) {
    socket.disconnect(true);
    return;
  }

  // ── JOIN LOBBY ──────────────────────────────
  socket.on("joinLobby", async ({ gameCode }) => {
    try {
      const game = await Game.findOne({ gameCode }).populate("players.userId");
      if (!game) return socket.emit("lobbyError", { message: "Game not found" });

      socket.join(gameCode);

      socket.emit("identity", { myUserId: socket.userId });

      // ✅ Auto-start if room is now full
      if (game.status === "waiting" && game.players.length >= game.maxPlayer) {
        game.status = "active";
        game.currentTurn = game.players[0].userId._id;
        await game.save();
      }

      io.to(gameCode).emit("lobbyUpdate", {
        players: game.players,
        maxPlayer: game.maxPlayer,
        status: game.status,
        game: game,
      });

      if (game.status === "active") {
        io.to(gameCode).emit("gameStart", {
          gameId: game._id,
          game,
        });
      }

    } catch (err) {
      console.error("joinLobby error:", err);
      socket.emit("lobbyError", { message: "Unable to join lobby" });
    }
  });

  socket.on("requestIdentity", () => {
    socket.emit("identity", { myUserId: socket.userId });
  });

  // ── ROLL DICE ───────────────────────────────
  //
  // Flow:
  //  1. Verify it's this player's turn
  //  2. Lock with isProcessing (mutex — prevents double rolls)
  //  3. Generate dice on server (client CANNOT fake this)
  //  4. Store dice in game.pendingDice
  //  5. Broadcast diceResult to room for animation
  //  6. After animation client emits "playTurn" (no dice value sent)
  //
  socket.on("rollDice", async ({ gameCode }) => {
    try {
      // ── Atomic lock: find game where it's this player's turn AND not already processing
      const game = await Game.findOneAndUpdate(
        {
          gameCode,
          status: "active",
          currentTurn: userId,
          isProcessing: false,   // ← only wins if not locked
        },
        { $set: { isProcessing: true } },
        { new: true }
      );

      // If null → either not their turn, or another rollDice already won the lock
      if (!game) return;

      // Server decides dice — client has zero control over this
      const diceValue = Math.floor(Math.random() * 6) + 1;

      // Store on DB so playTurn uses server's value, not client's
      game.pendingDice = diceValue;
      await game.save();

      await game.populate("players.userId");

      // Tell everyone to animate
      io.to(gameCode).emit("diceResult", {
        diceValue,
        rolledBy: userId,
        players: game.players,
      });

      // System message in chat
      io.to(gameCode).emit("receiveMessage", {
        id: Date.now(),
        sender: "System",
        content: `${username} rolled ${diceValue}`,
        type: "system",
        time: new Date().toLocaleTimeString(),
      });

    } catch (err) {
      console.error("rollDice error:", err);
    }
  });

  // ── PLAY TURN ───────────────────────────────
  //
  // Called by client after dice animation finishes.
  // Server uses its own pendingDice — client sends nothing critical.
  //
  socket.on("playTurn", async ({ gameCode }) => {
    try {
      const game = await Game.findOne({ gameCode });

      if (!game || game.status !== "active") return;

      // Must be this player's turn
      if (game.currentTurn.toString() !== userId.toString()) return;

      // Must have gone through rollDice (isProcessing flag proves it)
      if (!game.isProcessing) return;

      // Server uses its own stored dice — client cannot manipulate this
      const dice = game.pendingDice;
      if (!dice) return;

      // ── Find current player
      const currentIndex = game.players.findIndex(
        p => p.userId.toString() === userId.toString()
      );
      if (currentIndex === -1) return;

      const player = game.players[currentIndex];
      const oldPosition = player.position;
      const newPosition = (player.position + dice) % 32;
      if (newPosition < oldPosition) player.cashRemaining += 200;

      // ── Move player position (server-calculated)
      player.position = (player.position + dice) % 32;

      // ── Find card at new position
      const card = await Card.findOne({ position: player.position });
      if (!card) {
        console.error("No card found at position:", player.position);
        return;
      }

      // ── Card effect
      let mysteryCase = null;
      let needsAction = false;
      let actionPayload = null;



      switch (card.category) {

        case "start": {
          // player.cashRemaining += 200;
          break;
        }

        case "mystery": {
          mysteryCase = getMysteryCard();
          player.cashRemaining += mysteryCase.amount;
          // Clamp cash — can't go below 0
          // if (player.cashRemaining < 0) player.cashRemaining = 0;
          break;
        }

        case "public": {
          // Public tiles hit everyone, no shield consideration — raw parliament damage
          applyPublicDamage(player, card.weaponDamage);
          break;
        }

        case "weapon": {
          if (!card.isPurchasable) {
            // Non-purchasable weapon — hits the player directly
            applyDamage(player, card.weaponDamage);
            break;
          }

          const owner = findCardOwner(game, card._id);

          if (!owner) {
            // Nobody owns it — player needs to buy or start a bid
            // DO NOT advance turn yet — pause here
            needsAction = true;
            if (player.cashRemaining < card.price) {
              actionPayload = {
                type: "Bid",
                card: {
                  id: card._id,
                  name: card.name,
                  price: card.price,
                },
              };
            } else {
              actionPayload = {
                type: "buyOrBid",
                card: {
                  id: card._id,
                  name: card.name,
                  price: card.price,
                },
              };
            }

          } else if (owner.userId.toString() === userId.toString()) {
            // Player landed on their own card — no effect
          } else {
            // Owned by someone else — apply damage to current player
            const scientistBonus = 1 + (owner.scientist * 0.03);
            let dmg = card.weaponDamage * scientistBonus;

            // Agent halves the damage received
            if (player.agent) dmg = dmg / 2;

            applyDamage(player, dmg);
          }
          break;
        }

        case "terror": {
          // Terror tiles cost cash
          player.cashRemaining = player.cashRemaining - card.price;
          break;
        }

        case "safe": {
          // Nothing happens
          break;
        }

        case "agent": {
          // Agent buff activates — stays on until next non-agent tile
          player.agent = true;
          break;
        }

        case "scientist": {
          player.scientist += 1;
          break;
        }

        case "engineer": {
          player.remainingParliamentHp = Math.min(1000, player.remainingParliamentHp + 100);
          break;
        }

        default: {
          console.error("Unknown card category:", card.category);
          break;
        }
      }

      // ── If player HP dropped to 0, eliminate them
      if (player.remainingParliamentHp <= 0) {
        player.remainingParliamentHp = 0;
        player.isActive = false;
      }

      // Agent resets after every tile EXCEPT the agent tile itself
      if (card.category !== "agent") {
        player.agent = false;
      }
      // ── skippedChances handling (if you want to skip turns)
      // if (player.skippedChances >= 4) {
      //   player.isActive = false;
      // }

      // ── Find next active player
      const nextIndex = getNextActiveIndex(game, currentIndex);

      // ── Check win condition (only one active player left)
      const activePlayers = game.players.filter(p => p.isActive);
      if (activePlayers.length <= 1) {
        game.status = "finished";
        game.winner = activePlayers[0]?.userId || userId;
        game.isProcessing = false;
        game.pendingDice = null;
        await game.save();
        await game.populate("players.userId");

        io.to(gameCode).emit("gameOver", {
          winner: game.winner,
          players: game.players,
        });
        return;
      }

      // ── If action required (buy/bid) — pause turn, don't advance yet
      // if (needsAction) {
      //   game.pendingAction = {
      //     type: actionPayload.type,
      //     cardId: card._id,
      //     playerId: player.userId,
      //   };
      //   // Keep isProcessing = true — turn isn't over
      //   // Keep currentTurn = same player — they still need to act
      //   await game.save();
      //   await game.populate("players.userId");

      //   // Send current board state to everyone (pawn moved)
      //   io.to(gameCode).emit("boardUpdate", {
      //     players: game.players,
      //   });

      //   // Tell the acting player they need to make a choice
      //   socket.emit("actionRequired", {
      //     type: actionPayload.type,
      //     card: actionPayload.card,
      //     playerCash: player.cashRemaining,
      //   });
      //   return;
      // }

      // ── If action required (buy/bid) — pause turn, don't advance yet
      if (needsAction) {
        game.pendingAction = {
          type: actionPayload.type,
          cardId: card._id,
          playerId: player.userId,
        };

        await game.save();
        await game.populate("players.userId");

        io.to(gameCode).emit("boardUpdate", { players: game.players });

        // ✅ If they can't afford it — skip the modal, auto-start bid immediately
        if (actionPayload.type === "Bid") {
          const BID_DURATION = 20;

          game.pendingAction.type = "bidding";
          game.pendingAction.bids = [];
          game.pendingAction.bidDeadline = new Date(Date.now() + BID_DURATION * 1000);
          await game.save();

          io.to(gameCode).emit("bidStarted", {
            card: actionPayload.card,
            minBid: 1,
            duration: BID_DURATION,
          });

          io.to(gameCode).emit("receiveMessage", {
            id: Date.now(), sender: "System",
            content: `${username} can't afford ${actionPayload.card.name}! Auto-auction started.`,
            type: "system", time: new Date().toLocaleTimeString(),
          });

          setTimeout(async () => {
            await resolveBid(gameCode, card);
          }, BID_DURATION * 1000 + 500);

          return;
        }

        // They CAN afford it — show buy or bid choice
        socket.emit("actionRequired", {
          type: actionPayload.type,
          card: actionPayload.card,
          playerCash: player.cashRemaining,
        });
        return;
      }

      // ── Normal turn end — advance to next player
      game.currentTurn = game.players[nextIndex].userId;
      game.turnNo += 1;
      game.isProcessing = false;
      game.pendingDice = null;
      game.pendingAction = null;

      await game.save();
      await game.populate("players.userId");

      io.to(gameCode).emit("turnResult", {
        players: game.players,
        currentTurn: game.players[nextIndex].userId._id,
        turnNo: game.turnNo,
        mysteryCase,
        cardLanded: {
          name: card.name,
          category: card.category,
        },
      });

      io.to(gameCode).emit("receiveMessage", {
        id: Date.now(),
        sender: "System",
        content: `${username} landed on ${card.name}`,
        type: "system",
        time: new Date().toLocaleTimeString(),
      });

    } catch (err) {
      console.error("playTurn error:", err);

      // Safety unlock — if something crashes, release the lock
      await Game.findOneAndUpdate(
        { gameCode },
        { $set: { isProcessing: false, pendingDice: null } }
      );
    }
  });

  // ── PLAYER ACTION (Buy / Bid / Skip) ────────
  //
  // Called when player responds to actionRequired
  //
  // socket.on("playerAction", async ({ gameCode, action }) => {
  //   // action = "buy" | "skip"
  //   try {
  //     const game = await Game.findOne({ gameCode });
  //     if (!game || game.status !== "active") return;

  //     // Must be this player's pending action
  //     if (!game.pendingAction) return;
  //     if (game.pendingAction.playerId.toString() !== userId.toString()) return;

  //     const currentIndex = game.players.findIndex(
  //       p => p.userId.toString() === userId.toString()
  //     );
  //     const player = game.players[currentIndex];
  //     const card = await Card.findById(game.pendingAction.cardId);

  //     if (action === "buy") {
  //       // Verify they can still afford it (double check server side)
  //       if (player.cashRemaining < card.price) {
  //         return socket.emit("actionError", { message: "Not enough cash" });
  //       }
  //       player.cashRemaining -= card.price;
  //       player.cards.push({ cardId: card._id });
  //       console.log("card.id", card._id);
  //       console.log("cards", player.cards);

  //       io.to(gameCode).emit("receiveMessage", {
  //         id: Date.now(),
  //         sender: "System",
  //         content: `${username} purchased ${card.name}`,
  //         type: "system",
  //         time: new Date().toLocaleTimeString(),
  //       });
  //     }
  //     // action === "skip" → player chose not to buy, nothing happens

  //     // ── Advance turn now that action is resolved
  //     const nextIndex = getNextActiveIndex(game, currentIndex);

  //     game.currentTurn = game.players[nextIndex].userId;
  //     game.turnNo += 1;
  //     game.isProcessing = false;
  //     game.pendingDice = null;
  //     game.pendingAction = null;

  //     await game.save();
  //     await game.populate("players.userId");

  //     io.to(gameCode).emit("turnResult", {
  //       players: game.players,
  //       currentTurn: game.players[nextIndex].userId._id,
  //       turnNo: game.turnNo,
  //       mysteryCase: null,
  //       cardLanded: { name: card.name, category: card.category },
  //     });

  //   } catch (err) {
  //     console.error("playerAction error:", err);
  //   }
  // });


  // ─────────────────────────────────────────────
  // ADD THESE TWO THINGS TO gameSocket.js
  // ─────────────────────────────────────────────

  // 1. In playerAction handler — replace the action === "bid" comment with this:

  socket.on("playerAction", async ({ gameCode, action }) => {
    try {
      const game = await Game.findOne({ gameCode });
      if (!game || game.status !== "active") return;
      if (!game.pendingAction) return;
      if (game.pendingAction.playerId.toString() !== userId.toString()) return;

      const currentIndex = game.players.findIndex(
        p => p.userId.toString() === userId.toString()
      );
      const player = game.players[currentIndex];
      const card = await Card.findById(game.pendingAction.cardId);

      if (action === "buy") {
        if (player.cashRemaining < card.price) {
          return socket.emit("actionError", { message: "Not enough cash" });
        }
        player.cashRemaining -= card.price;
        player.cards.push({ cardId: card._id });

        io.to(gameCode).emit("receiveMessage", {
          id: Date.now(), sender: "System",
          content: `${username} purchased ${card.name}`,
          type: "system", time: new Date().toLocaleTimeString(),
        });

        // Advance turn
        const nextIndex = getNextActiveIndex(game, currentIndex);
        game.currentTurn = game.players[nextIndex].userId;
        game.turnNo += 1;
        game.isProcessing = false;
        game.pendingDice = null;
        game.pendingAction = null;
        await game.save();
        await game.populate("players.userId");

        io.to(gameCode).emit("turnResult", {
          players: game.players,
          currentTurn: game.players[nextIndex].userId._id,
          turnNo: game.turnNo,
          mysteryCase: null,
          cardLanded: { name: card.name, category: card.category },
        });
        return;
      }

      if (action === "bid") {
        // Save bid state — pendingAction stays, turn stays paused
        // minBid = 1 (anyone can bid any amount ≥ 1)
        // duration = 20 seconds for all players to submit bids
        const BID_DURATION = 20; // seconds

        game.pendingAction = {
          ...game.pendingAction.toObject(),
          type: "bidding",
          bids: [],           // will collect { userId, amount }
          bidDeadline: new Date(Date.now() + BID_DURATION * 1000),
        };
        await game.save();

        // Broadcast bid start to ALL players in the room
        io.to(gameCode).emit("bidStarted", {
          card: { id: card._id, name: card.name, price: card.price },
          minBid: 1,
          duration: BID_DURATION,
        });

        io.to(gameCode).emit("receiveMessage", {
          id: Date.now(), sender: "System",
          content: `Auction started for ${card.name}! ${BID_DURATION}s to bid.`,
          type: "system", time: new Date().toLocaleTimeString(),
        });

        // Auto-resolve after deadline
        setTimeout(async () => {
          await resolveBid(gameCode, card);
        }, BID_DURATION * 1000 + 500); // +500ms buffer
        return;
      }

    } catch (err) {
      console.error("playerAction error:", err);
    }
  });


  // 2. submitBid handler — player sends their bid amount during active auction

  socket.on("submitBid", async ({ gameCode, amount }) => {
    try {
      const game = await Game.findOne({ gameCode });
      if (!game || game.status !== "active") return;
      if (!game.pendingAction || game.pendingAction.type !== "bidding") return;

      // Bid deadline passed
      if (new Date() > new Date(game.pendingAction.bidDeadline)) return;

      const player = game.players.find(p => p.userId.toString() === userId.toString());
      if (!player || !player.isActive) return;

      // Validate amount
      const bidAmt = Math.floor(Number(amount));
      if (!bidAmt || bidAmt < 1) return;
      if (player.cashRemaining < bidAmt) return;

      // Remove previous bid from this player if they re-bid
      const existingBidIndex = game.pendingAction.bids.findIndex(
        b => b.userId.toString() === userId.toString()
      );
      if (existingBidIndex !== -1) {
        game.pendingAction.bids.splice(existingBidIndex, 1);
      }

      game.pendingAction.bids.push({ userId, amount: bidAmt });
      await game.save();

      console.log(`${username} bid $${bidAmt} on ${game.pendingAction.cardId}`);

    } catch (err) {
      console.error("submitBid error:", err);
    }
  });


  // ─────────────────────────────────────────────
  // 3. resolveBid helper — paste this OUTSIDE gameSocket export, near the other helpers
  // ─────────────────────────────────────────────

  async function resolveBid(gameCode, card) {
    try {
      const game = await Game.findOne({ gameCode }).populate("players.userId");
      if (!game || game.status !== "active") return;
      if (!game.pendingAction || game.pendingAction.type !== "bidding") return;

      const bids = game.pendingAction.bids || [];

      // Find highest bidder who still has enough cash
      const validBids = bids
        .map(b => {
          const player = game.players.find(p => p.userId._id.toString() === b.userId.toString());
          return player && player.cashRemaining >= b.amount && player.isActive
            ? { player, amount: b.amount }
            : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.amount - a.amount); // highest first

      // Find the landing player's original index for turn advance
      const landingPlayerId = game.pendingAction.playerId;
      const currentIndex = game.players.findIndex(
        p => p.userId._id.toString() === landingPlayerId.toString()
      );

      if (validBids.length === 0) {
        // Nobody bid — card stays unowned, turn just advances
        io.to(gameCode).emit("bidResult", {
          winnerName: null,
          amount: 0,
          cardName: card.name,
        });

        io.to(gameCode).emit("receiveMessage", {
          id: Date.now(), sender: "System",
          content: `No bids for ${card.name}. Card remains unowned.`,
          type: "system", time: new Date().toLocaleTimeString(),
        });

      } else {
        const winner = validBids[0];
        winner.player.cashRemaining -= winner.amount;
        winner.player.cards.push({ cardId: card._id });

        // const winnerUsername = (await game.populate("players.userId"))
        //   .players.find(p => p.userId._id.toString() === winner.player.userId.toString())
        //   ?.userId?.username || "Unknown";

        io.to(gameCode).emit("bidResult", {
          winnerName: winner.player?.userId?.username,
          amount: winner.amount,
          cardName: card.name,
        });

        io.to(gameCode).emit("receiveMessage", {
          id: Date.now(), sender: "System",
          content: `${winner.player.userId?.username} won ${card.name} for $${winner.amount}`,
          type: "system", time: new Date().toLocaleTimeString(),
        });
      }

      // Advance turn
      const nextIndex = getNextActiveIndex(game, currentIndex);
      game.currentTurn = game.players[nextIndex].userId;
      game.turnNo += 1;
      game.isProcessing = false;
      game.pendingDice = null;
      game.pendingAction = null;

      await game.save();
      await game.populate("players.userId");

      io.to(gameCode).emit("turnResult", {
        players: game.players,
        currentTurn: game.players[nextIndex].userId._id,
        turnNo: game.turnNo,
        mysteryCase: null,
        cardLanded: { name: card.name, category: card.category },
      });

    } catch (err) {
      console.error("resolveBid error:", err);
    }
  }


  // ── DISCONNECT ───────────────────────────────
  socket.on("disconnect", async () => {
    console.log(`${username} disconnected`);

    // Safety: if they disconnect mid-turn, release the lock
    // so the game doesn't get permanently stuck
    try {
      const game = await Game.findOne({
        currentTurn: userId,
        isProcessing: true,
      });

      if (game) {
        game.isProcessing = false;
        game.pendingDice = null;
        // Optionally skip their turn on disconnect
        // game.currentTurn = game.players[nextIndex].userId;
        await game.save();
      }
    } catch (err) {
      console.error("disconnect cleanup error:", err);
    }
  });
}
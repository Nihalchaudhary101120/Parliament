import Game from "../models/GameSession.js";
import Card from "../models/cards.js"
export const createRoom = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { gameCode, maxPlayer } = req.query;

    if (!gameCode || !maxPlayer || maxPlayer < 2 || maxPlayer > 6) return res.status(400).json({ message: "gameCode not found or invalid maxPlayer", success: false, });

    const game = await Game.create({
      gameCode,
      maxPlayer,
      players: [
        {
          userId: userId,
          cards: [],
          isBot: false,

          remainingParliamentHp: 1000,
          remainingShieldHp: 0,

          cashRemaining: 1200,
          position: 0,

          skippedChances: 0,
          isActive: true
        }
      ],
      currentTurn: null,
      status: "waiting"

    });
    res.status(200).json({
      success: true,
      gameCode: game.gameCode,
      gameId: game._id
    })

  }

  catch (err) {
    res.json({ message: "error creating game", error: err.message })
  }
}


export const joinRoom = async (req, res) => {
  try {
    const { gameCode } = req.query;
    const userId = req.session.userId;

    const game = await Game.findOne({ gameCode });

    if (!game) {
      return res.status(404).json({ error: "Room not found" });
    }

    // prevent same user joining twice
    const alreadyJoined = game.players.some(p =>
      p.userId.equals(userId)
    );

    if (alreadyJoined) {
      return res.json({ success: true, gameId: game._id });
    }

    if (game.players.length >= game.maxPlayer) {
      return res.status(400).json({ error: "Room is full" });
    }

    game.players.push({
      userId,
      cards: [],
      isBot: false,

      remainingParliamentHp: 1000,
      remainingShieldHp: 0,

      cashRemaining: 1200,
      position: 0,

      skippedChances: 0,
      isActive: true
    });

    if (game.players.length == game.maxPlayer) {
      game.status = "active";
      game.turnNo = 1;
      game.currentTurn = game.players[0].userId;
    }
    await game.save();

    res.json({
      success: true,
      gameId: game._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const turn = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { gameId, dice ,chanceSkipped } = req.query;

    const game = await Game.findById(gameId);

    if (!game || game.status !== "active") {
      return res.status(400).json({ error: "Game not active" });
    }

    // turn validation
    if (!game.currentTurn.equals(userId)) {
      return res.status(403).json({ error: "Not your turn" });
    }

    const player = game.players.find(p =>
      p.userId.equals(userId)
    );
    if(chanceSkipped){
      (player.skippedChances)++;
    }
    
    if (player.skippedChances == 4) {
      player.isActive = false;
    }

    const currentIndex = game.players.findIndex(p =>
      p.userId.equals(userId)
    );

    let nextIndex = (currentIndex + 1) % game.players.length;

    // skip inactive players if later needed
    while (!game.players[nextIndex].isActive) {
      nextIndex = (nextIndex + 1) % game.players.length;
    }

    player.position = (player.position + dice) % 32;


    await game.save();

    res.json({
      success: true,
      newPosition: player.position
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




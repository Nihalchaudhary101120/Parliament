import Game from "../models/GameSession.js";

export const createRoom = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { gameCode , maxPlayer } = req.query;

        if (!gameCode || !maxPlayer || 2>maxPlayer>6   ) return res.status(400).json({ message: `${res.message} gameCode not found or invalid maxPlayer`, success: false  ,});

        const game = await Game.create({
            gameCode,

            players: [
                {
                    userId: userId,
                    cards: [],
                    isBot: false,

                    remainingParliamentHp: 1000,
                    remainingShieldHp: 0,

                    cashRemaining: 1200,   // starting money (adjust later)
                    position: 0,          // start tile

                    skippedChances: 0,
                    isActive: true
                }
            ],

            currentTurn: userId,

        });
        res.status(200).json({
            success: true,
            gameCode: game.gameCode,
            gameId: game._id
        })

    }

    catch (err) {
        res.json({message:"error creating game" ,error:err.message })
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

    // limit players (2 for now)
    if (game.players.length >= maxPlayer) {
      return res.status(400).json({ error: "Room is full" });
    }

    // add second player
    game.players.push({
      userId,
      cards: [],
      isBot: false,

      remainingParliamentHp: 1000,
      remainingShieldHp: 0,

      cashRemaining: 500,
      position: 0,

      skippedChances: 0,
      isActive: true
    });

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

import Game from "../models/GameSession.js";
import Card from "../models/cards.js";

export const createRoom = async (req, res) => {
  try {
    const user = req.session.user;
    const { gameCode, maxPlayer } = req.body;

    if (!gameCode || !maxPlayer || maxPlayer < 2 || maxPlayer > 6) return res.status(400).json({ message: "gameCode not found or invalid maxPlayer", success: false });

    const game = await Game.create({
      gameCode,
      maxPlayer,
      players: [
        {
          userId: user.id,
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
    console.log({ message: "error creating game", err });
    res.json({ message: "error creating game", error: err.message });
  }
}


export const joinRoom = async (req, res) => {
  try {
    const { gameCode } = req.query;
    const user = req.session.user;
    const userId = user.id;

    const game = await Game.findOne({ gameCode });

    if (!game) {
      return res.status(404).json({ error: "Room not found" });
    }

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

const getMysteryCard = () => {
  const getRand = () => Math.floor((Math.random() * 10) + 4);
  const MysteryBox = [
    {
      amount: +150,
      statement: "Foreign investment deal approaved",
    },
    {
      amount: +100,
      statement: "Tax from citizens"
    },
    {
      amount: +110,
      statement: "Black Money Raid"
    },
    {
      amount: +130,
      statement: "Received emergency funding from supporters"
    },
    {
      amount: +101,
      statement: "Public rally success donation"
    },
    {
      amount: -100,
      statement: "Curruption investigation fine"
    },
    {
      amount: -90,
      statement: "Emergency defence spending"
    },
    {
      amount: -120,
      statement: "Cyber attack repair cost"
    },
    {
      amount: -50,
      statement: "Printed War money"
    },
    {
      amount: 100,
      statement: "Bribe attempt works"
    },
    {
      amount: -100,
      statement: "Bribe attempt caught"
    },
    {
      amount: -100,
      statement: "Successful strike, looted enemy resources"
    }, {
      amount: -100,
      statement: "Defence drone deployed"
    }
  ]
  return MysteryBox[getRand];

}

export const turn = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { gameId, dice, chanceSkipped } = req.query;

    const game = await Game.findById(gameId);

    if (!game || game.status !== "active") {
      return res.status(400).json({ message: "Game not active" });
    }

    // turn validation
    if (!game.currentTurn.equals(userId)) {
      return res.status(403).json({ message: "Not your turn" });
    }

    const player = game.players.find(p =>
      p.userId.equals(userId)
    );

    if (chanceSkipped) {
      (player.skippedChances)++;
    }

    if (player.skippedChances == 4) {
      player.isActive = false;
    }

    const currentIndex = game.players.findIndex(p =>
      p.userId.equals(userId)
    );

    let nextIndex = (currentIndex + 1) % game.players.length;

    while (!game.players[nextIndex].isActive) {
      nextIndex = (nextIndex + 1) % game.players.length;
    }

    player.position = (player.position + dice) % 32;

    const card = await Card.find({ position: player.position });
    let purchased = false;

    if (card.isPurchasable) {
      for (p of game.players) {
        for (c of p.cards) {
          if (c.cardId === card._id) {
            purchased = true;
          }
        }
      }
      if (purchased) { //damage to current player
        player.remainingParliamentHp -= card.weaponDamage
      } else { //buy or bid

      }
    }

    let mysteryCase = {};
    if (!card.isPurchasable) {
      switch (card.category) {
        case "public":
          player.remainingParliamentHp -= card.weaponDamage;
          break;

        case "terror":
          player.cashRemaining -= card.price;
          break;

        case "safe":
          break;

        case "mystry":
          mysteryCase = getMysteryCard();
          player.cashRemaining += mysteryCase.amount;
          break;

        case "agent":
          // apply 
          break;

        case "scientist":
          // applly
          break;

        case "engineer":
          // apply
          break;

        default:
          throw new Error("Unknown card category");
      }

    }

    await game.save();



    res.json({
      mysteryCase,
      success: true,
      newPosition: player.position
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
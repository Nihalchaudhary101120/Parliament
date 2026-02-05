import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
    players: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true
            },
            cards: [
                {
                    cardId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'cards',
                        required: true
                    }
                }
            ],
            isBot: { type: Boolean, required: true },
            remainingParliamentHp: { type: Number, default: 1000, required: true },
            remainingShieldHp: { type: Number },
            cashRemaining: { type: Number, required: true },
            position: { type: Number, required: true },
            skippedChances: { type: Number, default: 0 },

            isActive: { type: Boolean, required: true }
        }
    ],
    maxPlayer: { type: Number, required: true },
    gameCode: { type: String, required: true },
    currentTurn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    turnNo: Number,
    timebombPurchaseTurn: Number,
    status: {
        type: String,
        enum: ["waiting", "active", "finished"],
        default: "waiting"
    }


});

export default mongoose.model('game-session', GameSchema);
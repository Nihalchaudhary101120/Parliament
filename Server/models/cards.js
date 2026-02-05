import mongoose from "mongoose";

const cardsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    weaponDamage: { type: Number }, // for weapons
    weaponCooldown: Number,
    ShieldHp: Number,
    isPurchasable: Boolean,
});

export default mongoose.model('cards', cardsSchema);

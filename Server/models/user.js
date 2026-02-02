import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    passHash: { type: String, default: null },
    isGuest: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
    lastActive: { type: Date, default: Date.now() },
    sessionToken: { type: String, unique: true },
});

export default mongoose.model('user', userSchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, default: null },
    passHash: { type: String, default: null },
    isGuest: { type: Boolean },
    createdAt: Date,
    lastActive: Date,
    sessionToken: String,
});

export default mongoose.model('user', userSchema);
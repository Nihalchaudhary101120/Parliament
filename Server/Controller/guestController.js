import User from "../models/user.js";
import generateGuestUsername from "../utils/generateUsername.js";
import generateSessionToken from "../utils/generateSession.js";

export const createGuest = async (req, res) => {
    const username = generateGuestUsername();
    const session = generateSessionToken();
    try {
        const user = await User.create({
            username,
            isGuest: true,
            sessionToken: session
        });

        res.status(200).json({
            sessionToken: session,
            username,
            isGuest: true,
            success: true
        });
    } catch (err) {
        res.status(500).json({ message: "Error creating guest", success: false, error: err.message });
        console.log("Error creating guest", err);
    }
};
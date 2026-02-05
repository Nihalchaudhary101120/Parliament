import User from "../models/user.js";
import generateGuestUsername from "../utils/generateUsername.js";


export const createGuest = async (req, res) => {
    const username = generateGuestUsername();
    try {
        const user = await User.create({
            username,
            isGuest: true,
        });
        req.session.regenerate(err => {
            if (err) {
                console.error("Session regenerate error:", err);
                return res.status(500).json({ message: "Error starting session" });
            }

            req.session.userId = user._id;
            console.log("session: ", req.session);
            console.log("sessionID: ", req.sessionID);
            
        });
        

        res.status(200).json({
            sessionToken:req.session.userId,
            username,
            isGuest: true,
            success: true
        });
      
    } catch (err) {
        res.status(500).json({ message: "Error creating GuestUser", success: false, error: err.message });
        console.log("Error creating guest", err);
    }
};
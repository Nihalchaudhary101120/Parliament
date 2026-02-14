import User from "../models/user.js";
import generateGuestUsername from "../utils/generateUsername.js";

export const createGuest = async (req, res) => {
    try {
        const username = generateGuestUsername();

        const user = await User.create({
            username,
            isGuest: true,
        });

        await new Promise((resolve, reject) => {
            req.session.regenerate((err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        req.session.user = {
            id: user._id,
            username: user.username
        };

        user.sessionToken = req.session.user.id;
        await user.save();

        res.status(200).json({
            success: true,
            username: user.username,
            isGuest: true,
            sessionToken: req.session.user.id
        });

    } catch (err) {
        console.error("Error creating guest:", err);
        res.status(500).json({
            success: false,
            message: "Error creating GuestUser",
            error: err.message
        });
    }
};

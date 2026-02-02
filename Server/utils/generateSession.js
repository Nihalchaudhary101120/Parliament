import crypto from "crypto";

const generateSessionToken = () => {
    return crypto.randomBytes(32).toString("hex");
}

export default generateSessionToken;


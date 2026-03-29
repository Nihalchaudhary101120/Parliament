import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoute from "./route/authRoute.js";
import session from "express-session";
import gameRoute from "./route/gameRoute.js";
import cardController from "./Controller/card.Contoller.js";
import MongoStore from "connect-mongo";

connectDB();
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'https://parliamentbattle.vercel.app/',
    credentials: true
}));
const sessionMiddleWare = session({
    secret: process.env.Secret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.ATLAS_URI,
        collectionName: "sessions"
    }),
    cookie: {
        secure: true,
        httpOnly: true,
        sameSite: "none"
    }
});
app.use('/cards', cardController);
app.use(sessionMiddleWare);
app.use('/auth', authRoute);
app.use('/friends', gameRoute);

export { sessionMiddleWare, app };


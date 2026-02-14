import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoute from "./route/authRoute.js";
import session from "express-session";
connectDB();
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
 const sessionMiddleWare= session({
    secret: "beverage-campa",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    }
});
app.use('/auth', authRoute);
app.use( sessionMiddleWare );

export{sessionMiddleWare , app } ;


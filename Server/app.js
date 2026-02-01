import express from "express";
import "dotenv/config";
import connectDB from "./config/db.js";
import cors from "cors";


connectDB();
const app = express();
app.use(express.json());


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const port = 3000;
app.listen(port, () => console.log(`server running at port ${port}`));
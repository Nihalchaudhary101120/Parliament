import {createGuest} from "../Controller/guestController.js";
import express from "express";

const router = express.Router();

router.get('/guest', createGuest);

export default router;
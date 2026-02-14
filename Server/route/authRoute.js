import {createGuest} from "../Controller/guestController.js";
import express from "express";

const router = express.Router();

router.get('/guest', createGuest);


router.get('/me',(req,res)=>{
    if (!req.session.user) {
    return res.status(401).json({ success: false });
  }

  res.json({
    success: true,
    user: req.session.user
  });
})

export default router;
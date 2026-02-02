import  Game from "../models/GameSession.js";
import crypto from 'crypto';
import mongoose from 'mongoose';


export const createRoom = async(req, res)=>{
    const gameCode= ()=>crypto.randomInt(100000,999999).toString();
    try{
        const{userId}=req.params

    }
    
    catch(err){

    }
}
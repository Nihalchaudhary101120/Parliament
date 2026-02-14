import { useNavigate } from "react-router-dom";
import "./EntryPage.css";
import React, { useState, useEffect } from "react";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function EntryPage() {
    const { handleGuest} = useAuth();

    
    return (
        <>
            <div className="entry-container">
                <div className="entry-card">
                    <h1 className="entry-title">PARLIAMENT BATTLEGROUND</h1>
                    <p className="entry-subtitle">Choose how you want to enter</p>

                    <button className="entry-btn guest" onClick={handleGuest}>Continue as Guest</button>


                    {/* {showGuestModal && (
                        <div className="modal">
                            <div className="modal-box">
                                <h3>Enter Nickname</h3>
                                <div onClick={() => setShowGuestModal(false)}>X</div>
                                <input
                                    type="text"
                                    value={nickName}
                                    onChange={(e) => setNickName(e.target.value)}
                                    placeholder="Your nickname"
                                />
                                <button onClick={handleGuest}>Enter Game</button>
                            </div>
                        </div>
                    )} */}



                    <button className="entry-btn login" onClick={() => navigate("/login")}>
                        Login
                    </button>
                    <button className="entry-btn signup" onClick={() => navigate("/signup")}>
                        Sign Up
                    </button>
                </div>
            </div>
        </>
    )
}
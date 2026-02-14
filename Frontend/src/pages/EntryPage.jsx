import { useNavigate } from "react-router-dom";
import "./EntryPage.css";
import React, { useState, useEffect } from "react";
import api from "../api/api.js";

export default function EntryPage() {
    const navigate = useNavigate();


    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await api.get("/auth/me");

                if (res.data.success) {
                    navigate("/dashboard");   // auto redirect
                }
            } catch (err) {
                console.log("error in authme",err);
                // not logged in → stay here
            }
        };

        checkSession();
    }, []);

    const handleGuest = async () => {
        try {
            const res = await api.get("/auth/guest");
            console.log("Guest created:", res.data);

            navigate("/dashboard");
        } catch (err) {
            console.log("Guest login failed", err);
        }
    };
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
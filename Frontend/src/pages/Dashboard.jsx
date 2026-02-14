import React from 'react';
import "./Dashboard.css";
import { useEffect } from 'react';
import accounting from "../assets/parliament.jpeg";
import { connectSocket } from "../Component/socket.js";
import { useNavigate } from "react-router-dom";


const DashBoard = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const res = await fetch("http://localhost:3000/auth/me", {
                credentials: "include"
            });

            if (res.status === 200) {
                // session already exists
                connectSocket();
            } else {
                // create guest session
                await fetch("http://localhost:3000/auth/guest", {
                    credentials: "include"
                });
                connectSocket();
            }
        };

        checkSession();
    }, []);

    const handleOnlineMultiplayer =  () => {
        
        // 3. go to lobby
        navigate("/lobby");
    };
    return (

        <div className='hero'>
            <div className='kuch'>
                <h1 className="logo-name">PARLIAMENT  BATTLEGROUND</h1>
                <h2 className="quote">Control The Flow Of Nation</h2>
            </div>


            <div>
                <img src={accounting} className="profile"></img>
            </div>

            <div className="glass-panel">
                <h2 className="panel-title ">GAME MODE</h2>

                <button className="glass-btn sharp-btn">🎮 Player VS Computer</button>
                <button className="glass-btn sharp-btn" onClick={handleOnlineMultiplayer}>🌐 Online Multiplayer</button>
                <button className="glass-btn sharp-btn">👥 Play with Friends</button>
            </div>

            <div className="bottom-bar">
                <button className="nav-btn">⚙️<span>Settings</span></button>
                <button className="nav-btn">📩<span>Inbox</span></button>
                <button className="nav-btn">👥<span>Friends</span></button>
            </div>


            <div className="glass-panel2">
                <h2 className="panel-title">Lobby</h2>
                <hr></hr>
                <div className="friend" >

                    <p> <button>+</button> Nihal <span>online</span>      </p>
                    <p> <button>+</button> Shlok  <span>online</span>     </p>
                    <p> <button>+</button> Tanmay  <span>online</span>    </p>
                    <p> <button>+</button> Dhangar <span>offline</span>    </p>
                </div>

            </div>

        </div>

    );
}

export default DashBoard;
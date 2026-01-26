import React from 'react';
import "./Dashboard.css";
import accountimg from"../assets/account.png";

const DashBoard = () => {
    return (

        <>

            <h1 className="logo-name">PARLIAMENT  BATTLEGROUND</h1>
            <h2 className="quote">Control The Flow Of Nation</h2>

            <div>
                 <img src={accountimg} className="profile"></img>
            </div>

            <div className="glass-panel">
                <h2 className="panel-title ">GAME MODE</h2>

                <button className="glass-btn sharp-btn">🎮 Player VS Computer</button>
                <button className="glass-btn sharp-btn">🌐 Online Multiplayer</button>
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

        </>

    );
}

export default DashBoard;
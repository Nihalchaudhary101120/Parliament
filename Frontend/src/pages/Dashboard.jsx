import react from 'react';
import "./Dashboard.css";

const DashBoard = () => {
    return (

        <>

            <div class="glass-panel">
                <h2 class="panel-title ">GAME MODE</h2>

                <button class="glass-btn sharp-btn">🎮 Player VS Computer</button>
                <button class="glass-btn sharp-btn">🌐 Online Multiplayer</button>
                <button class="glass-btn sharp-btn">👥 Play with Friends</button>
            </div>


        </>

    );
}

export default DashBoard;
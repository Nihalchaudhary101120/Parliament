import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./home.css";

export default function Home() {
    return (
        <>
            <Helmet>
                <title>Parliament Battle - Play Online Strategy Game</title>
                <meta
                    name="description"
                    content="Play Parliament Battle online. A multiplayer strategy board game with weapons, bidding system, and real-time gameplay."
                />
            </Helmet>

            <div className="home-container">
                <h1 className="title">Parliament Battle</h1>

                <p className="subtitle">
                    Play real-time strategy battles with friends. Use smart moves,
                    weapons, and tactics to defeat opponents.
                </p>

                <div className="buttons">
                    <Link to="/entry" className="btn primary">
                        Start Playing
                    </Link>

                    <Link to="/how-to-play" className="btn secondary">
                        How to Play
                    </Link>
                </div>
            </div>
        </>
    );
}

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Home() {
    return (
        <>
            <Helmet>
                <title>Parliament Battle- Online Board Game</title>
                <meta
                    name="description"
                    content="Play parliament battle online. Multiplayer board game with strategy and fun gameplay."
                />
            </Helmet>

            <h1>Parliament Battle</h1>

            <p>
                parliament battle is an exciting multiplayer board game where players compete
                using strategy, luck, and smart moves. Play online with friends or join a lobby.
            </p>
            <p>
                Includes weapons, bidding system, special cards like Scientist, Engineer,
                and Agent, along with real-time multiplayer gameplay.
            </p>

            <Link to="/entry">Start Playing</Link>
            <br />
            <Link to="/how-to-play">How to Play</Link>
        </>
    );
}
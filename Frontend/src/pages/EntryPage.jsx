import "./EntryPage.css";
import { useAuth } from "../context/AuthContext.jsx";

export default function EntryPage() {
    const { handleGuest } = useAuth();


    return (
        <>
            <div className="entry-container">
                <div className="entry-card">
                    <h1 className="entry-title">PARLIAMENT BATTLEGROUND</h1>
                    <p className="entry-subtitle">Choose how you want to enter</p>

                    <button className="entry-btn guest" onClick={handleGuest}>Continue as Guest</button>
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
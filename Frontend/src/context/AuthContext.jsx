import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    const checkSession = async () => {
        try {
            const res = await api.get("/auth/me");
            setUser(res.data.user);
            console.log(res.data);

            if (res.data.success) {
                navigate("/dashboard");
            }
        } catch (err) {
            console.log("error in authme", err);
            navigate("/");
        }
    };

    const handleGuest = async () => {
        try {
            const res = await api.get("/auth/guest");
            console.log("Guest created:", res.data);
            setUser(res.data);
            navigate("/dashboard");
        } catch (err) {
            console.log("Guest login failed", err);
        }
    };

    useEffect(() => {
        checkSession();
    }, [])

    return (
        <AuthContext.Provider value={{ checkSession, user, handleGuest }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 
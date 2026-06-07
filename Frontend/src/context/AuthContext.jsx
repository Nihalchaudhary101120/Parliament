import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { Navigate, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();

    const location = useLocation();

    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    const checkSession = async () => {
        try {
            const res = await api.get("/auth/me");


            if (res.data.success) {
                setUser(res.data.user);
                const publicPaths = ["/", "/login", "/signup", "/entry"];
                if (publicPaths.includes(location.pathname)) {
                    const intended = location.state?.from || "/dashboard";
                    navigate(intended, { replace: true });
                }
            }
        } catch (err) {
            console.log("error in authme", err);
            setUser(null);
            // navigate("/");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleGuest = async () => {
        try {
            const res = await api.get("/auth/guest");
            console.log("Guest created:", res.data);
            // server now returns { success, user: { id, username, isGuest } }
            if (res.data.user) {
                setUser(res.data.user);
                const intended = location.state?.from || "/dashboard";
                navigate(intended, { replace: true });
            }
        } catch (err) {
            console.log("Guest login failed", err);
        }
    };

    const signup = async (email, password) => {
        try {
            const res = await api.post('/auth/signup', { email, password });
            setUser(res.data.user);
            const intended = location.state?.from || "/dashboard";
            navigate(intended, { replace: true });
            return { success: true };
        } catch (err) {
            console.error('Signup error', err?.response?.data || err.message);
            return { success: false, error: err?.response?.data?.message || err.message };
        }
    };

    const signin = async (email, password) => {
        try {
            const res = await api.post('/auth/signin', { email, password });
            setUser(res.data.user);
            const intended = location.state?.from || "/dashboard"; // ← go back to lobby if that's where they came from
            navigate(intended, { replace: true });
            return { success: true };
        } catch (err) {
            console.error('Signin error', err?.response?.data || err.message);
            return { success: false, error: err?.response?.data?.message || err.message };
        }
    };

    const setUsername = async (username) => {
        try {
            const res = await api.post('/auth/username', { username });
            setUser(res.data.user);
            return { success: true };
        } catch (err) {
            console.error('Set username error', err?.response?.data || err.message);
            return { success: false, error: err?.response?.data?.message || err.message };
        }
    };

    const signout = async () => {
        try {
            await api.post('/auth/signout');
        } catch (err) {
            // ignore
        } finally {
            setUser(null);
            navigate('/');
        }
    };

    useEffect(() => {
        checkSession();
    }, [])

    return (
        <AuthContext.Provider value={{ checkSession, user, handleGuest, signup,authLoading, signin, setUsername, signout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 
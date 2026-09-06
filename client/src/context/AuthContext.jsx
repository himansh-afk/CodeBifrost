import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

const API_BASE = "http://localhost:5000";

function getTokenExpiry(token) {
    if (!token) return null;
    try {
        const payload = JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );
        if (payload.exp && Date.now() / 1000 > payload.exp) return null;
        return payload;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(() => {
        const token = localStorage.getItem("token");

        if (!getTokenExpiry(token)) {
            setUser(null);
            setLoading(false);
            return Promise.resolve();
        }

        setLoading(true);
        return fetch(`${API_BASE}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                if (!res.ok) {
                    localStorage.removeItem("token");
                    setUser(null);
                    return;
                }
                return res.json().then(setUser);
            })
            .catch(() => {

            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "token") fetchUser();
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [fetchUser]);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setUser(null);
    }, []);

    const refreshUser = useCallback(() => {
        return fetchUser();
    }, [fetchUser]);

    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
import { createContext, useState, useEffect } from "react";
import { login, register, logout, getMe } from "./services/auth.api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => { 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Automatically check for an active user session on app mount
    useEffect(() => {
        const verifyUserSession = async () => {
            try {
                const data = await getMe();
                if (data && data.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.log("No active structural token session initialized.");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        verifyUserSession();
    }, []);

    /**
     * @description Orchestrates user authentication session mapping
     */
    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            if (data && data.user) {
                setUser(data.user);
            }
            return data;
        } catch (error) {
            console.error("Context Login Architecture Error:", error);
            alert(error.response?.data?.message || "Invalid authentication parameters.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * @description Provisions secure node allocation for a new user account
     */
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            if (data && data.user) {
                setUser(data.user);
            }
            return data;
        } catch (error) {
            console.error("Context Registration Architecture Error:", error);
            alert(error.response?.data?.message || "Registration parameter constraints unmet.");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    /**
     * @description Terminates active token verification parameters gracefully
     */
    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error("Context Security Termination Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            loading,
            setLoading,
            handleLogin,
            handleRegister,
            handleLogout
        }} >
            {children}
        </AuthContext.Provider>
    );
};
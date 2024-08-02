import {ReactNode} from "react";
import {createContext, useState, useEffect, useContext} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext(undefined);

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(["access_token", "refresh_token"]);
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserFromToken = async () => {
            if (cookies.access_token) {
                try {
                    await verifyToken();
                } catch (error) {
                    console.error("Token verification failed:", error);
                    setUser(null); // Set user to null only if token verification fails
                }
            }
        };

        fetchUserFromToken();
    }, [cookies.access_token]); // Add cookies.access_token as a dependency

    const verifyToken = async () => {
        try {
            const response = await fetch(`${baseUrl}/protected`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
            });

            if (response.status === 401) {
                // Attempt to refresh token if unauthorized
                await refreshToken();
                return; // Do not set user here; refreshToken will handle it
            }

            const data = await response.json();
            console.log("Verified user data:", data.user);
            setUser(data.user); // Update user if verification is successful
        } catch (e) {
            console.error("Error verifying token:", e);
            setUser(null); // Set user to null if there's an error
        }
    };

    const refreshToken = async () => {
        try {
            const response = await fetch(`${baseUrl}/refresh_token`, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to refresh token");
            }

            const data = await response.json();
            await verifyToken(); // Verify the token again after refreshing
        } catch (e) {
            console.error("Error refreshing token:", e);
            setUser(null); // Set user to null if refresh fails
            logout(); // Optionally, navigate to login or home
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${baseUrl}/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
                credentials: "include",
            });

            if (!response.ok) {
                navigate("/");
                throw new Error("Login failed");
            }

            const data = await response.json();
            setUser(data.user);
        } catch (e) {
            console.error("Error during login: a", e);
            setUser(null); // Clear user state upon logout
            navigate("/");
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(`${baseUrl}/logout`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({message: "logout"}),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            setUser(null); // Clear user state upon logout
            // removeCookie("access_token", {path: "/"});
            // removeCookie("refresh_token", {path: "/"});
            navigate("/"); // Navigate to the home or login page
        } catch (e) {
            console.error("Error during logout:", e);
        }
    };

    return (
        <AuthContext.Provider value={{user, login, logout, verifyToken, refreshToken}}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthContext, AuthProvider};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

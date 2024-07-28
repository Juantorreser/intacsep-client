import {ReactNode} from "react";
import {createContext, useState, useEffect, useContext} from "react";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";


const AuthContext = createContext(undefined);

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [cookies] = useCookies(["access_token", "refresh_token"]);
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserFromToken = async () => {
            try {
                await verifyToken();
            } catch (error) {
                setUser(null);
            }
        };

        if (cookies.access_token) {
            fetchUserFromToken();
        }
    }, [cookies.access_token]);

    const verifyToken = async () => {
        try {
            const response = await fetch(`${baseUrl}/protected`, {
                method: "POST",
                headers: {"content-type": "application/json"},
                credentials: "include",
            });

            if (response.status === 401) {
                await refreshToken();
            }

            if (!response.ok) {
                throw new Error("Network Error");
            }
            const data = await response.json();
            setUser(data.user);
        } catch (e) {
            setUser(null);
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
            verifyToken();
        } catch (e) {
            setUser(null);
            navigate("/");
            logout();
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${baseUrl}/login`, {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({email, password}),
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Login failed");
            }
            const data = await response.json();
            setUser(data.user);
        } catch (e) {
            console.log(e);
        }
        console.log('Logged');
    };

    const logout = async () => {
        try {
            const response = await fetch(`${baseUrl}/logout`, {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({message: "logout"}),
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Logout failed");
            }
            setUser(null);
            navigate("/");
        } catch (e) {
            console.log(e);
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

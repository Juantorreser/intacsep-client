import React, {createContext, useState, useRef, useContext, useEffect} from "react";
import {Navigate} from "react-router-dom";
import Login from "../components/Login";

const TimeoutContext = createContext();

export const useTimeout = () => {
    return useContext(TimeoutContext);
};

export const TimeoutProvider = ({children}) => {
    const [timeout, setTimeoutValue] = useState(120000); // Default timeout: 2 minutes
    const inactivityTimeoutRef = useRef(null);

    useEffect(() => {
        console.log(timeout);
    }, [timeout]);

    const resetTimeout = () => {
        const navigate = Navigate();
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }
        inactivityTimeoutRef.current = setTimeout(() => {
            console.log("Inactivity timeout reached");
            return (
                <div className="inactivity-popup">
                    <div className="content">
                        <i className="fa fa-info-circle"></i>
                        <h1>Sesión Expirada</h1>
                        <p>Su sesión ha expirado debido al tiempo de inactividad.</p>
                        <p>Favor de iniciar sesión nuevamente</p>
                        <button onClick={navigate("/login")}>Iniciar Sesión</button>
                    </div>
                </div>
            );
        }, timeout);
    };

    const modifyTimeout = (newTimeout) => {
        setTimeoutValue(newTimeout);
        resetTimeout();
    };

    return (
        <TimeoutContext.Provider
            value={{timeout, modifyTimeout, resetTimeout, inactivityTimeoutRef}}>
            {children}
        </TimeoutContext.Provider>
    );
};

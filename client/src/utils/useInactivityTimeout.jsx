import {useEffect, useRef} from "react";

const useInactivityTimeout = (timeout = 120000, onTimeout) => {
    const timeoutId = useRef(null);
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];

    const resetTimeout = () => {
        if (timeoutId.current) clearTimeout(timeoutId.current);
        timeoutId.current = setTimeout(onTimeout, timeout);
    };

    useEffect(() => {
        const handleActivity = () => resetTimeout();

        events.forEach((event) => {
            window.addEventListener(event, handleActivity);
        });

        resetTimeout(); // Initialize timeout

        return () => {
            if (timeoutId.current) clearTimeout(timeoutId.current);
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [timeout, onTimeout]);
};

export default useInactivityTimeout;

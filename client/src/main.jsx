import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./context/AuthContext.jsx";
import {TimeoutProvider} from "./context/TimeoutContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <TimeoutProvider>
                    <App />
                </TimeoutProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);

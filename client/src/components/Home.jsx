import React, {useEffect} from "react";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import Header from "./Header";

const Home = () => {
    const {user, logout, verifyToken} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        try {
            verifyToken();
        } catch (e) {
            navigate("/login");
        }
    }, []);
    return (
        <>
            <Header />
            <div>Home</div>
            <button onClick={logout}>logout</button>
        </>
    );
};

export default Home;

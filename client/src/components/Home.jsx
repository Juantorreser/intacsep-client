import React, {useEffect} from "react";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

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
            <div className="d-none d-lg-flex w-25 bg-danger">
                <Sidebar />
            </div>
        </>
    );
};

export default Home;

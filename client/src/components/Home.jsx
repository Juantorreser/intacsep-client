import React, {useEffect} from "react";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Home = () => {
    const {user, logout, verifyToken} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        try {
            verifyToken();
        } catch (e) {
            navigate("/login");
        }
    }, [user]);
    return (
        <section id="homeScreen" className="vh-100">
            <Header />
            <div className="d-none d-lg-flex w-25 h-100">
                <Sidebar />
            </div>
            <Footer/>
        </section>
    );
};

export default Home;

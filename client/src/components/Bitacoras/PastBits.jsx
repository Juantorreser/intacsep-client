import React, {useEffect} from "react";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const PastBits = () => {
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
        <section id="homeScreen">
            <Header />
            <div className="d-none d-lg-flex w-25 ">
                <Sidebar />
                PAsADAS
            </div>
            <Footer />
        </section>
    );
};

export default PastBits;

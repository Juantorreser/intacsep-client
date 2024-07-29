import React, {useState, useEffect} from "react";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const ActiveBits = () => {
    const {user, logout, verifyToken} = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        try {
            verifyToken();
        } catch (e) {
            navigate("/login");
        }
    }, [user]);

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    return (
        <section id="activeBits">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-25">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
                    <h1 className="text-center fs-3 fw-semibold text-black">Bitácoras Activas</h1>
                    <div className="text-center mt-4">
                        <button className="btn btn-primary" onClick={handleModalToggle}>
                            Crear Bitácora
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal with Backdrop */}
            {showModal && (
                <>
                    <div
                        className="modal fade show d-block"
                        id="exampleModal"
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">
                                        Example Form
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleModalToggle}
                                        aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInput" className="form-label">
                                                Example Field
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="exampleInput"
                                                placeholder="Enter something"
                                            />
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleModalToggle}>
                                        Close
                                    </button>
                                    <button type="button" className="btn btn-primary">
                                        Save changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Backdrop */}
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            <Footer />
        </section>
    );
};

export default ActiveBits;

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const {logout} = useAuth();
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary ps-3 pe-3 pt-2 pb-2">
                <div className="container-fluid">
                    <button
                        className="btn d-md-block d-lg-none"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasWithBothOptions"
                        aria-controls="offcanvasWithBothOptions">
                        <a className="navbar-brand text-white" href="#">
                            <img
                                src="/logo1.png"
                                alt="Logo"
                                width="30"
                                className="d-inline-block align-text-top"
                            />
                            <span className="ms-2">Intacsep</span>
                        </a>
                    </button>
                    <a className="navbar-brand text-white d-none d-lg-flex" href="#">
                        <img
                            src="/logo1.png"
                            alt="Logo"
                            width="30"
                            className="d-inline-block align-text-top"
                        />
                        <span className="ms-2">Intacsep</span>
                    </a>
                    <div className="d-flex flex-row" id="navbarNav">
                        <ul className="navbar-nav ms-auto gap-4 d-flex flex-row">
                            <li className="nav-item">
                                <a
                                    className="nav-link active text-white"
                                    aria-current="page"
                                    href="">
                                    <i className="fas fa-envelope"></i>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link active text-white"
                                    aria-current="page"
                                    href="">
                                    <i className="fas fa-bell"></i>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link active text-white"
                                    aria-current="page"
                                    href="#"
                                    onClick={logout}>
                                    <i className="fas fa-power-off"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div
                className="offcanvas offcanvas-start d-md-none"
                data-bs-scroll="true"
                tabindex="-1"
                id="offcanvasWithBothOptions"
                aria-labelledby="offcanvasWithBothOptionsLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
                        Off-canvas Menu
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <p>Try scrolling the rest of the page to see this option in action.</p>
                </div>
            </div>
        </>
    );
};

export default Header;

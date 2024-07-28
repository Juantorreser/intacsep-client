import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary ps-3 pe-3 pt-2 pb-2">
            <div className="container-fluid">
                <a class="navbar-brand text-white" href="#">
                    <img
                        src="/logo1.png"
                        alt="Logo"
                        width="30"
                        class="d-inline-block align-text-top"
                    />
                    <span className="ms-2">Intacsep</span>
                </a>
                {/* <button
                    className="navbar-toggler border-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="text-white">
                      <i className="fa fa-bars"></i>
                    </span>
                </button> */}
                <div className=" d-flex flex-row" id="navbarNav">
                    <ul className="navbar-nav ms-auto gap-4 d-flex flex-row">
                        <li className="nav-item">
                            <a className="nav-link active text-white" aria-current="page" href="#">
                                <i className="fas fa-envelope"></i>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active text-white" aria-current="page" href="#">
                                <i className="fas fa-bell"></i>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active text-white" aria-current="page" href="#">
                                <i className="fas fa-power-off"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;

import React from "react";

const Sidebar = () => {
    return (
        <aside id="leftsidebar" className="sidebar bg-body-tertiary w-100 vh-100">
            <div className="d-flex flex-column align-items-start p-3">
                {/* User Info */}
                <div
                    className="d-flex align-items-center text-white-50 w-100 justify-content-start"
                    style={{height: "100px"}}>
                    <div className="d-flex justify-content-center align-items-center w-25 h-100">
                        <i className="fa fa-user" style={{fontSize: "3em"}}></i>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-start ms-2">
                        <span className="d-block" style={{fontSize: "0.8rem"}}>
                            Bienvenido
                        </span>
                        <h5 style={{fontSize: "1.2rem"}}>John Smith</h5>
                        {/* <ul className="list-unstyled d-flex">
                            <li className="me-2">
                                <a title="Go to Inbox" href="mail-inbox.html">
                                    <i className="fa fa-envelope"></i>
                                </a>
                            </li>
                            <li className="me-2">
                                <a title="Go to Profile" href="profile.html">
                                    <i className="bi bi-person"></i>
                                </a>
                            </li>
                            <li>
                                <a title="Full Screen" href="sign-in.html">
                                    <i className="bi bi-box-arrow-in-right"></i>
                                </a>
                            </li>
                        </ul> */}
                    </div>
                </div>
                {/* #User Info */}

                {/* Menu */}
                <ul className="nav flex-column w-100">
                    <li className="nav-item mb-2">
                        <hr className="my-1 text-white" />
                        <span className="nav-link text-white-50 fw-bold letter-spacing-lg">MENÚ</span>
                        <hr className="my-1 text-white" />
                    </li>

                    {/* Bitacora Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#adminXMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="adminXMenu">
                            <i className="bi bi-house-door"></i>
                            <span className="ms-2">adminX</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="adminXMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="index.html">
                                    Dashboard 1
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="dashboard.html">
                                    Dashboard 2
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="dashboard3.html">
                                    Dashboard 3
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="dashboard-rtl.html">
                                    Dashboard 3 RTL
                                </a>
                            </li>
                        </ul>
                    </li>

                    {/* Configuracion Menu */}
                    <li className="nav-item">
                        <a
                            className="nav-link collapsed"
                            data-bs-toggle="collapse"
                            href="#settingsMenu"
                            role="button"
                            aria-expanded="false"
                            aria-controls="settingsMenu">
                            <i className="bi bi-gear"></i>
                            <span className="ms-2">Settings</span>
                        </a>
                        <ul className="collapse nav flex-column ms-3" id="settingsMenu">
                            <li className="nav-item">
                                <a className="nav-link" href="settings.html">
                                    Settings
                                </a>
                            </li>
                        </ul>
                    </li>

                </ul>
                {/* #Menu */}
            </div>
        </aside>
    );
};

export default Sidebar;

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {useAuth} from "../context/AuthContext";

const Sidebar = () => {
    const {user} = useAuth();
    console.log(user);
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
                        <h5 style={{fontSize: "1.2rem"}}>{`${user.firstName} ${user.lastName}`}</h5>
                    </div>
                </div>
                {/* #User Info */}

                {/* Menu */}
                <ul className="nav flex-column w-100">
                    <li className="nav-item mb-2">
                        <hr className="my-1 text-white" />
                        <span className="nav-link text-white-50 fw-bold letter-spacing-lg">
                            MENÚ
                        </span>
                        <hr className="my-1 text-white" />
                    </li>

                    {/* Dashboard Menu */}
                    <li className="nav-item ms-3">
                        <p className="">
                            <a
                                className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center me-2"
                                data-bs-toggle="collapse"
                                href="#dashboardCollapse"
                                role="button"
                                aria-expanded="false"
                                aria-controls="dashboardCollapse">
                                Dashboard
                                <i className="fa fa-plus text-white-50 my-auto icon-toggle"></i>
                            </a>
                        </p>
                        <div className="collapse" id="dashboardCollapse">
                            <ul className="nav flex-column w-75 ms-4 gap-2">
                                <li className="text-white-50 cursor-pointer">dashboard 1</li>
                                <li className="text-white-50 cursor-pointer">dashboard 2</li>
                            </ul>
                        </div>
                    </li>

                    {/* Bitacoras Menu */}
                    <li className="nav-item ms-3">
                        <p className="">
                            <a
                                className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center me-2"
                                data-bs-toggle="collapse"
                                href="#bitacorasCollapse"
                                role="button"
                                aria-expanded="false"
                                aria-controls="bitacorasCollapse">
                                Bitacoras
                                <i className="fa fa-plus text-white-50 my-auto icon-toggle"></i>
                            </a>
                        </p>
                        <div className="collapse" id="bitacorasCollapse">
                            <ul className="nav flex-column w-75 ms-4 gap-2">
                                <li className="text-white-50 cursor-pointer">bitacora 1</li>
                                <li className="text-white-50 cursor-pointer">bitacora 2</li>
                            </ul>
                        </div>
                    </li>

                    {/* Settings Menu */}
                    <li className="nav-item ms-3">
                        <p className="">
                            <a
                                className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center me-2"
                                data-bs-toggle="collapse"
                                href="#settingsCollapse"
                                role="button"
                                aria-expanded="false"
                                aria-controls="settingsCollapse">
                                Settings
                                <i className="fa fa-plus text-white-50 my-auto icon-toggle"></i>
                            </a>
                        </p>
                        <div className="collapse" id="settingsCollapse">
                            <ul className="nav flex-column w-75 ms-4 gap-2">
                                <li className="text-white-50 cursor-pointer">setting 1</li>
                                <li className="text-white-50 cursor-pointer">setting 2</li>
                            </ul>
                        </div>
                    </li>

                    {/* integraciones Menu */}
                    <li className="nav-item ms-3">
                        <p className="">
                            <a
                                className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center me-2"
                                data-bs-toggle="collapse"
                                href="#settingsCollapse"
                                role="button"
                                aria-expanded="false"
                                aria-controls="settingsCollapse">
                                Integraciones
                                <i className="fa fa-plus text-white-50 my-auto icon-toggle"></i>
                            </a>
                        </p>
                        <div className="collapse" id="settingsCollapse">
                            <ul className="nav flex-column w-75 ms-4 gap-2">
                                <li className="text-white-50 cursor-pointer">Integraciones 1</li>
                                <li className="text-white-50 cursor-pointer">Integraciones 2</li>
                            </ul>
                        </div>
                    </li>
                </ul>
                {/* #Menu */}
            </div>
        </aside>
    );
};

export default Sidebar;

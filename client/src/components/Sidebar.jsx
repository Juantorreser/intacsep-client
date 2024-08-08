import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";

const Sidebar = () => {
    const {user, verifyToken, setUser} = useAuth();
    const navigate = useNavigate();
    const [roleData, setRoleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false); // Track initialization
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const init = async () => {
            try {
                const data = await verifyToken(); // Ensure user is verified
                setUser(data);
                setInitialized(true); // Set initialization as complete
            } catch (e) {
                console.log("Error verifying token or fetching user:", e);
                navigate("/login");
            } finally {
                setLoading(false); // Set loading to false once initialization is done
            }
        };

        init();
    }, []); // Run only on mount

    useEffect(() => {
        const fetchRolePermissions = async () => {
            if (!user) return; // Ensure user is available before fetching role data

            try {
                const response = await fetch(`${baseUrl}/roles/${user.role}`);
                const data = await response.json();
                setRoleData(data);
            } catch (e) {
                console.log("Error fetching role permissions:", e);
            }
        };

        if (initialized) {
            fetchRolePermissions();
        }
    }, [initialized, user, baseUrl]);

    const [collapsedItems, setCollapsedItems] = useState({
        dashboardCollapse: false,
        bitacorasCollapse: false,
        settingsCollapse: false,
        integrationsCollapse: false,
    });

    const toggleCollapse = (item) => {
        setCollapsedItems((prevState) => ({
            ...prevState,
            [item]: !prevState[item],
        }));
    };

    if (loading) {
        return <div>Loading...</div>; // Add a loading indicator
    }

    return (
        <aside id="leftsidebar" className="sidebar bg-body-tertiary w-100 h-100">
            <div className="d-flex flex-column align-items-start p-3">
                {/* User Info */}
                <div
                    className="d-flex align-items-center text-white-50 w-100 justify-content-start cursor-pointer"
                    style={{height: "100px"}}
                    onClick={() => navigate("/perfil")}
                >
                    <div className="d-flex justify-content-center align-items-center w-25 h-100">
                        <i className="fa fa-user" style={{fontSize: "3em"}}></i>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-start ms-2">
                        <span className="d-block" style={{fontSize: "0.8rem"}}>
                            Bienvenido (a)
                        </span>
                        <h5 style={{fontSize: "1.2rem"}}>
                            {user && user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : "Usuario"}
                        </h5>
                        {user && (
                            <>
                                <span style={{fontSize: "0.8rem"}}>
                                    {user.email || "Email no disponible"}
                                </span>
                                <span style={{fontSize: "0.8rem"}}>
                                    {user.role || "Rol no disponible"}
                                </span>
                            </>
                        )}
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
                    {/* <li className="nav-item ms-3">
                        <p className="">
                            <a
                                className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center me-2"
                                role="button"
                                onClick={() => toggleCollapse("dashboardCollapse")}>
                                Dashboard
                                <i
                                    className={`fa ${
                                        collapsedItems.dashboardCollapse ? "fa-minus" : "fa-plus"
                                    } text-white-50 my-auto icon-toggle`}></i>
                            </a>
                        </p>
                        <div
                            className={`collapse ${
                                collapsedItems.dashboardCollapse ? "show" : ""
                            }`}>
                            <ul className="nav flex-column w-75 ms-4 gap-2">
                                <li className="text-white-50 cursor-pointer">dashboard 1</li>
                                <li className="text-white-50 cursor-pointer">dashboard 2</li>
                            </ul>
                        </div>
                    </li> */}

                    {/* Monitoreo Menu */}
                    {roleData && roleData.bitacoras && (
                        <li className="nav-item ms-3">
                            <p className="">
                                <a
                                    className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center"
                                    role="button"
                                    onClick={() => toggleCollapse("bitacorasCollapse")}>
                                    Monitoreo
                                    <i
                                        className={`fa ${
                                            collapsedItems.bitacorasCollapse
                                                ? "fa-minus"
                                                : "fa-plus"
                                        } text-white-50 my-auto icon-toggle me-2`}></i>
                                </a>
                            </p>
                            <div
                                className={`collapse ${
                                    collapsedItems.bitacorasCollapse ? "show" : ""
                                }`}>
                                <ul className="nav flex-column w-75 gap-2">
                                    <li
                                        className="text-white-50 cursor-pointer mb-3 ms-3 mt-0"
                                        onClick={() => navigate("/bitacoras")}>
                                        Bitácoras
                                    </li>
                                </ul>
                            </div>
                        </li>
                    )}

                    {/* Settings Menu */}
                    {roleData && (
                        <li className="nav-item ms-3">
                            <p className="">
                                <a
                                    className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center me-2"
                                    role="button"
                                    onClick={() => toggleCollapse("settingsCollapse")}>
                                    Configuración
                                    <i
                                        className={`fa ${
                                            collapsedItems.settingsCollapse ? "fa-minus" : "fa-plus"
                                        } text-white-50 my-auto icon-toggle`}></i>
                                </a>
                            </p>
                            <div
                                className={`collapse ${
                                    collapsedItems.settingsCollapse ? "show" : ""
                                }`}>
                                <ul className="nav flex-column w-75 ms-4 gap-2">
                                    {roleData.tipos_de_monitoreo && (
                                        <li
                                            className="text-white-50 cursor-pointer"
                                            onClick={() => navigate("/tipos_monitoreo")}>
                                            Tipos Monitoreo
                                        </li>
                                    )}
                                    {roleData.eventos && (
                                        <li
                                            className="text-white-50 cursor-pointer"
                                            onClick={() => navigate("/eventos")}>
                                            Eventos
                                        </li>
                                    )}
                                    {roleData.clientes && (
                                        <li
                                            className="text-white-50 cursor-pointer"
                                            onClick={() => navigate("/clientes")}>
                                            Clientes
                                        </li>
                                    )}
                                    {roleData.usuarios && (
                                        <li
                                            className="text-white-50 cursor-pointer"
                                            onClick={() => navigate("/usuarios")}>
                                            Usuarios
                                        </li>
                                    )}
                                    {roleData.roles && (
                                        <li
                                            className="text-white-50 cursor-pointer"
                                            onClick={() => navigate("/roles")}>
                                            Roles
                                        </li>
                                    )}
                                    {roleData.origenes && (
                                        <li
                                            className="text-white-50 cursor-pointer"
                                            onClick={() => navigate("/origenes")}>
                                            Origenes
                                        </li>
                                    )}
                                    {roleData.destinos && (
                                        <li
                                            className="text-white-50 cursor-pointer"
                                            onClick={() => navigate("/destinos")}>
                                            Destinos
                                        </li>
                                    )}
                                    {roleData.operadores && (
                                        <li
                                            className="text-white-50 cursor-pointer"
                                            onClick={() => navigate("/operadores")}>
                                            Operadores
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </li>
                    )}

                    {/* Integraciones Menu */}
                    {/* <li className="nav-item ms-3">
                        <p className="">
                            <a
                                className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center me-2"
                                role="button"
                                onClick={() => toggleCollapse("integrationsCollapse")}>
                                Integraciones
                                <i
                                    className={`fa ${
                                        collapsedItems.integrationsCollapse ? "fa-minus" : "fa-plus"
                                    } text-white-50 my-auto icon-toggle`}></i>
                            </a>
                        </p>
                        <div
                            className={`collapse ${
                                collapsedItems.integrationsCollapse ? "show" : ""
                            }`}>
                            <ul className="nav flex-column w-75 ms-4 gap-2">
                                <li className="text-white-50 cursor-pointer">Integraciones 1</li>
                                <li className="text-white-50 cursor-pointer">Integraciones 2</li>
                            </ul>
                        </div>
                    </li> */}
                </ul>
                {/* #Menu */}
            </div>
        </aside>
    );
};

export default Sidebar;

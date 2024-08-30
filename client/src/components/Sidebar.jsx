import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {faL} from "@fortawesome/free-solid-svg-icons";
import ProfileModal from "./Profile/ProfilePage";

const Sidebar = () => {
    const {user, verifyToken, setUser} = useAuth();
    const navigate = useNavigate();
    const [roleData, setRoleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false); // Track initialization
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

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
        catalogosCollapse: false,
        sistemaCollapse: false,
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
        <>
            <aside id="leftsidebar" className="sidebar bg-body-tertiary w-100 h-100">
                <div className="d-flex flex-column align-items-start p-3">
                    {/* User Info */}
                    <div
                        className="d-flex align-items-center text-white-50 w-100 justify-content-start cursor-pointer"
                        style={{height: "100px"}}
                        onClick={handleOpenModal}>
                        {/* <div className="d-flex justify-content-center align-items-center w-25 h-100">
                            <i className="fa fa-user" style={{fontSize: "3em"}}></i>
                        </div> */}
                        <div className="d-flex flex-column justify-content-center align-items-start ms-2 mb-3">
                            <span className="d-block mb-1" style={{fontSize: "0.75rem"}}>
                                Bienvenido (a)
                            </span>
                            <h5 style={{fontSize: "1rem"}}>
                                {user && user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : "Usuario"}
                            </h5>
                            {user && (
                                <>
                                    <span style={{fontSize: "0.75rem"}}>
                                        {user.email || "Email no disponible"}
                                    </span>
                                    <span style={{fontSize: "0.75rem"}}>
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

                        {/* Monitoreo Menu */}
                        {roleData && roleData.bitacoras && (
                            <li className="nav-item ms-3">
                                <p className="">
                                    <a
                                        className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center"
                                        role="button"
                                        onClick={() => toggleCollapse("bitacorasCollapse")}
                                        style={{fontSize: "0.95rem"}}>
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
                                            className="text-white-50 cursor-pointer mb-3 ms-2 mt-0"
                                            onClick={() => navigate("/bitacoras")}
                                            style={{fontSize: "0.92rem"}}>
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
                                        onClick={() => toggleCollapse("settingsCollapse")}
                                        style={{fontSize: "0.95rem"}}>
                                        Configuración
                                        <i
                                            className={`fa ${
                                                collapsedItems.settingsCollapse
                                                    ? "fa-minus"
                                                    : "fa-plus"
                                            } text-white-50 my-auto icon-toggle`}></i>
                                    </a>
                                </p>
                                <div
                                    className={`collapse ms-2 ${
                                        collapsedItems.settingsCollapse ? "show" : ""
                                    }`}>
                                    {/* Catálogos Collapsible */}
                                    <p className="mb-2">
                                        <a
                                            className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center me-2 itemLine"
                                            role="button"
                                            onClick={() => toggleCollapse("catalogosCollapse")}
                                            style={{fontSize: "0.92rem"}}>
                                            Catálogos
                                            <i
                                                className={`fa ${
                                                    collapsedItems.catalogosCollapse
                                                        ? "fa-minus"
                                                        : "fa-plus"
                                                } text-white-50 my-auto icon-toggle`}></i>
                                        </a>
                                    </p>
                                    <div
                                        className={`collapse ${
                                            collapsedItems.catalogosCollapse ? "show" : ""
                                        }`}>
                                        <ul className="nav flex-column w-75 ms-3 gap-2">
                                            {roleData.tipos_de_monitoreo && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/tipos_monitoreo")}
                                                    style={{fontSize: "0.85rem"}}>
                                                    Tipos Monitoreo
                                                </li>
                                            )}
                                            {roleData.eventos && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/eventos")}
                                                    style={{fontSize: "0.85rem"}}>
                                                    Eventos
                                                </li>
                                            )}
                                            {roleData.clientes && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/clientes")}
                                                    style={{fontSize: "0.85rem"}}>
                                                    Clientes
                                                </li>
                                            )}

                                            {roleData.origenes && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/origenes")}
                                                    style={{fontSize: "0.85rem"}}>
                                                    Origenes
                                                </li>
                                            )}
                                            {roleData.destinos && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/destinos")}
                                                    style={{fontSize: "0.85rem"}}>
                                                    Destinos
                                                </li>
                                            )}
                                            {roleData.operadores && (
                                                <li
                                                    className="text-white-50 cursor-pointer mb-3 itemLine2"
                                                    onClick={() => navigate("/operadores")}
                                                    style={{fontSize: "0.85rem"}}>
                                                    Operadores
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Sistema Collapsible */}
                                    <p className="">
                                        <a
                                            className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center me-2 itemLine p-0 mb-0"
                                            role="button"
                                            onClick={() => toggleCollapse("sistemaCollapse")}
                                            style={{fontSize: "0.92rem"}}>
                                            Sistema
                                            <i
                                                className={`fa ${
                                                    collapsedItems.sistemaCollapse
                                                        ? "fa-minus"
                                                        : "fa-plus"
                                                } text-white-50 my-auto icon-toggle`}></i>
                                        </a>
                                    </p>
                                    <div
                                        className={`collapse ${
                                            collapsedItems.sistemaCollapse ? "show" : ""
                                        }`}>
                                        <ul className="nav flex-column w-75 ms-4 gap-2 itemLine2">
                                            {roleData.usuarios && (
                                                <li
                                                    className="text-white-50 cursor-pointer"
                                                    onClick={() => navigate("/usuarios")}
                                                    style={{fontSize: "0.85rem"}}>
                                                    Usuarios
                                                </li>
                                            )}
                                            {roleData.roles && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/roles")}
                                                    style={{fontSize: "0.85rem"}}>
                                                    Roles
                                                </li>
                                            )}
                                            {roleData.inactividad && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/roles")}
                                                    style={{fontSize: "0.85rem"}}>
                                                    Inactividad
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
                    {/* #Menu */}
                </div>
            </aside>
            <aside id="leftsidebar" className="sidebar bg-body-tertiary w-100 h-100">
                <div className="d-flex flex-column align-items-start p-3">
                    {/* User Info */}
                    <div
                        className="d-flex align-items-center text-white-50 w-100 justify-content-start cursor-pointer"
                        style={{height: "100px"}}
                        onClick={handleOpenModal}>
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
                                                collapsedItems.settingsCollapse
                                                    ? "fa-minus"
                                                    : "fa-plus"
                                            } text-white-50 my-auto icon-toggle`}></i>
                                    </a>
                                </p>
                                <div
                                    className={`collapse ms-3 ${
                                        collapsedItems.settingsCollapse ? "show" : ""
                                    }`}>
                                    {/* Catálogos Collapsible */}
                                    <p className="mb-2">
                                        <a
                                            className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center me-2 itemLine"
                                            role="button"
                                            onClick={() => toggleCollapse("catalogosCollapse")}>
                                            Catálogos
                                            <i
                                                className={`fa ${
                                                    collapsedItems.catalogosCollapse
                                                        ? "fa-minus"
                                                        : "fa-plus"
                                                } text-white-50 my-auto icon-toggle`}></i>
                                        </a>
                                    </p>
                                    <div
                                        className={`collapse ${
                                            collapsedItems.catalogosCollapse ? "show" : ""
                                        }`}>
                                        <ul className="nav flex-column w-75 ms-4 gap-2">
                                            {roleData.tipos_de_monitoreo && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/tipos_monitoreo")}>
                                                    Tipos Monitoreo
                                                </li>
                                            )}
                                            {roleData.eventos && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/eventos")}>
                                                    Eventos
                                                </li>
                                            )}
                                            {roleData.clientes && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/clientes")}>
                                                    Clientes
                                                </li>
                                            )}

                                            {roleData.origenes && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/origenes")}>
                                                    Origenes
                                                </li>
                                            )}
                                            {roleData.destinos && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/destinos")}>
                                                    Destinos
                                                </li>
                                            )}
                                            {roleData.operadores && (
                                                <li
                                                    className="text-white-50 cursor-pointer mb-3 itemLine2"
                                                    onClick={() => navigate("/operadores")}>
                                                    Operadores
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Sistema Collapsible */}
                                    <p className="">
                                        <a
                                            className="text-white-50 text-decoration-none d-flex justify-content-between align-items-center me-2 itemLine"
                                            role="button"
                                            onClick={() => toggleCollapse("sistemaCollapse")}>
                                            Sistema
                                            <i
                                                className={`fa ${
                                                    collapsedItems.sistemaCollapse
                                                        ? "fa-minus"
                                                        : "fa-plus"
                                                } text-white-50 my-auto icon-toggle`}></i>
                                        </a>
                                    </p>
                                    <div
                                        className={`collapse ${
                                            collapsedItems.sistemaCollapse ? "show" : ""
                                        }`}>
                                        <ul className="nav flex-column w-75 ms-4 gap-2 itemLine2">
                                            {roleData.usuarios && (
                                                <li
                                                    className="text-white-50 cursor-pointer"
                                                    onClick={() => navigate("/usuarios")}>
                                                    Usuarios
                                                </li>
                                            )}
                                            {roleData.roles && (
                                                <li
                                                    className="text-white-50 cursor-pointer itemLine2"
                                                    onClick={() => navigate("/roles")}>
                                                    Roles
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
                    {/* #Menu */}
                </div>
            </aside>{" "}
            <ProfileModal showModal={showModal} handleClose={handleCloseModal} />
        </>
    );
};

export default Sidebar;

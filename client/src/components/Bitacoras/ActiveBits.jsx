import React, {useState, useEffect} from "react";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import BitacoraCard from "./BitacoraCard";

const ActiveBits = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const {user, logout, verifyToken} = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [bitacoras, setBitacoras] = useState([]);

    // Form state
    const operador = `${user.firstName} ${user.lastName}`;

    const [formData, setFormData] = useState({
        monitoreo: "",
        cliente: "",
        ecoTracto: "",
        placaTracto: "",
        ecoRemolque: "",
        placaRemolque: "",
        operador: operador,
        telefono: user.phone,
        origen: "",
        destino: "",
        enlaceRastreo: "",
        idAcceso: "",
        passwordAcceso: "",
        inicioMonitoreo: "",
        finalMonitoreo: "",
    });

    useEffect(() => {
        // Fetch bitacoras when the component mounts
        const fetchBitacoras = async () => {
            try {
                const response = await fetch(`${baseUrl}/bitacora_active`);
                if (response.ok) {
                    const data = await response.json();
                    setBitacoras(data);
                    console.log("Fetched bitácoras:", data);
                } else {
                    console.error("Failed to fetch bitácoras:", response.statusText);
                }
            } catch (e) {
                console.error("Error fetching bitácoras:", e);
            }
        };

        fetchBitacoras();

        try {
            verifyToken();
        } catch (e) {
            navigate("/login");
        }
    }, []);

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        handleModalToggle();
        setFormData({
            monitoreo: "",
            cliente: "",
            ecoTracto: "",
            placaTracto: "",
            ecoRemolque: "",
            placaRemolque: "",
            operador: operador,
            telefono: user.phone,
            origen: "",
            destino: "",
            enlaceRastreo: "",
            idAcceso: "",
            passwordAcceso: "",
            inicioMonitoreo: "",
            finalMonitoreo: "",
        });
        try {
            const response = await fetch(`${baseUrl}/bitacora`, {
                method: "POST",
                headers: {"content-type": "application/json"},
                credentials: "include",
                body: JSON.stringify(formData),
            });
        } catch (e) {
            console.log(e);
        }
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

                    {/* LIST */}
                    <div className="mx-3 my-4">
                        <ul className="list-unstyled">
                            {bitacoras.map((bitacora) => (
                                <li key={bitacora._id} className="mb-3">
                                    <BitacoraCard
                                        id={bitacora._id}
                                        destino={bitacora.destino}
                                        origen={bitacora.origen}
                                        monitoreo={bitacora.monitoreo}
                                        cliente={bitacora.cliente}
                                        id_enlace={bitacora.id_enlace}
                                        id_remolque={bitacora.id_remolque}
                                        id_tracto={bitacora.id_tracto}
                                        operador={bitacora.operador}
                                        telefono={bitacora.telefono}
                                        inicioMonitoreo={bitacora.inicioMonitoreo}
                                        finalMonitoreo={bitacora.finalMonitoreo}
                                        activa={bitacora.activa}
                                        iniciada={bitacora.iniciada}
                                    />
                                </li>
                            ))}
                        </ul>
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
                                        Crear Bitácora
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleModalToggle}
                                        aria-label="Close"></button>
                                </div>
                                <div className="modal-body w-100">
                                    <div className="w-100 col justify-content-center align-items-center">
                                        <img src="/logo2.png" alt="" width={50} />
                                        <p className="p-0 m-0"> Nueva Bitácora</p>
                                    </div>
                                    <hr />
                                    <form onSubmit={handleSubmit}>
                                        {/* Tipo de Monitoreo */}
                                        <div className="mb-3">
                                            <label htmlFor="monitoreo" className="form-label">
                                                Tipo de Monitoreo
                                            </label>
                                            <select
                                                className="form-select"
                                                id="monitoreo"
                                                aria-label="Tipo de Monitoreo"
                                                value={formData.monitoreo}
                                                onChange={handleChange}
                                                required>
                                                <option value="">Selecciona una opción</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </select>
                                        </div>

                                        {/* Cliente */}
                                        <div className="mb-3">
                                            <label htmlFor="cliente" className="form-label">
                                                Cliente
                                            </label>
                                            <select
                                                className="form-select"
                                                id="cliente"
                                                aria-label="Cliente"
                                                value={formData.cliente}
                                                onChange={handleChange}
                                                required>
                                                <option value="">Selecciona una opción</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                            </select>
                                        </div>

                                        <hr />

                                        {/* Tracto Information */}
                                        <div className="mb-3">
                                            <label
                                                htmlFor="tracto-label"
                                                className="form-label fw-semibold">
                                                Tracto
                                            </label>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label
                                                        htmlFor="eco-tracto"
                                                        className="form-label">
                                                        ECO (tracto)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ecoTracto"
                                                        maxLength="10"
                                                        value={formData.ecoTracto}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label
                                                        htmlFor="placa-tracto"
                                                        className="form-label">
                                                        PLACA (tracto)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="placaTracto"
                                                        maxLength="10"
                                                        value={formData.placaTracto}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <hr />

                                        {/* Remolque Information */}
                                        <div className="mb-3">
                                            <label
                                                htmlFor="remolque-label"
                                                className="form-label fw-semibold">
                                                Remolque
                                            </label>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label
                                                        htmlFor="eco-remolque"
                                                        className="form-label">
                                                        ECO (remolque)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ecoRemolque"
                                                        maxLength="10"
                                                        value={formData.ecoRemolque}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label
                                                        htmlFor="placa-remolque"
                                                        className="form-label">
                                                        PLACA (remolque)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="placaRemolque"
                                                        maxLength="10"
                                                        value={formData.placaRemolque}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <hr />

                                        {/* Operador */}
                                        <label
                                            htmlFor="remolque-label"
                                            className="form-label fw-semibold">
                                            Operador
                                        </label>
                                        <div className="mb-3">
                                            <label htmlFor="operador" className="form-label">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="operador"
                                                value={formData.operador}
                                                onChange={handleChange}
                                                required
                                                disabled
                                            />
                                        </div>

                                        {/* Teléfono */}
                                        <div className="mb-3">
                                            <label htmlFor="telefono" className="form-label">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="telefono"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                required
                                                disabled
                                            />
                                        </div>

                                        <hr />

                                        {/* Origen */}
                                        <div className="mb-3">
                                            <label htmlFor="origen" className="form-label">
                                                Origen
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="origen"
                                                value={formData.origen}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Destino */}
                                        <div className="mb-3">
                                            <label htmlFor="destino" className="form-label">
                                                Destino
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="destino"
                                                value={formData.destino}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <hr />

                                        {/* Enlace de rastreo */}
                                        <div className="mb-3">
                                            <label htmlFor="enlace-rastreo" className="form-label">
                                                Enlace de rastreo
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="enlaceRastreo"
                                                rows="3"
                                                maxLength="500"
                                                value={formData.enlaceRastreo}
                                                onChange={handleChange}
                                                required></textarea>
                                        </div>

                                        {/* ID Acceso */}
                                        <div className="mb-3">
                                            <label htmlFor="id-acceso" className="form-label">
                                                ID Acceso
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="idAcceso"
                                                maxLength="200"
                                                value={formData.idAcceso}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Contraseña de Acceso */}
                                        <div className="mb-3">
                                            <label htmlFor="password-acceso" className="form-label">
                                                Contraseña de Acceso
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="passwordAcceso"
                                                maxLength="200"
                                                value={formData.passwordAcceso}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <hr />

                                        <div className="text-center">
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-3"
                                                onClick={handleModalToggle}>
                                                Cancelar
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Crear Bitácora
                                            </button>
                                        </div>
                                    </form>
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

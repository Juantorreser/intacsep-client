import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "../Footer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faPlus} from "@fortawesome/free-solid-svg-icons";

const BitacoraDetail = () => {
    const {id} = useParams();
    const [bitacora, setBitacora] = useState(null);
    const [isEventStarted, setIsEventStarted] = useState(false);
    const [finishButtonDisabled, setFinishButtonDisabled] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [newEvent, setNewEvent] = useState({
        name: "",
        details: "",
        ubicacion: "",
        duracion: "",
        distancia: "",
    });

    const [eventTypes, setEventTypes] = useState([]);
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const fetchBitacora = async () => {
        try {
            const response = await fetch(`${baseUrl}/bitacora/${id}`);
            if (response.ok) {
                const data = await response.json();
                setBitacora(data);
                setIsEventStarted(data.status === "iniciada");
                setFinishButtonDisabled(data.status === "finalizada");
            } else {
                console.error("Failed to fetch bitácora:", response.statusText);
            }
        } catch (e) {
            console.error("Error fetching bitácora:", e);
        }
    };

    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await fetch(`${baseUrl}/event_types`);
                if (response.ok) {
                    const data = await response.json();
                    setEventTypes(data);
                } else {
                    console.error("Failed to fetch event types:", response.statusText);
                }
            } catch (e) {
                console.error("Error fetching event types:", e);
            }
        };

        fetchBitacora();
        fetchEventTypes();
    }, []);

    const handleStart = async () => {
        if (bitacora.status === "creada") {
            try {
                const response = await fetch(`${baseUrl}/bitacora/${id}/start`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        inicioMonitoreo: new Date().toISOString(), // Set the start time
                    }),
                    credentials: "include",
                });
                if (response.ok) {
                    const updatedBitacora = await response.json();
                    setBitacora(updatedBitacora);
                    setIsEventStarted(true);
                    setFinishButtonDisabled(false);
                } else {
                    console.error("Failed to start bitácora:", response.statusText);
                }
            } catch (e) {
                console.error("Error starting bitácora:", e);
            }
        }
        if (bitacora.status === "creada") {
            try {
                const response = await fetch(`${baseUrl}/bitacora/${id}/status`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: "iniciada",
                        inicioMonitoreo: new Date().toISOString(), // Set the start time
                    }),
                    credentials: "include",
                });
                if (response.ok) {
                    const updatedBitacora = await response.json();
                    setBitacora(updatedBitacora);
                    setIsEventStarted(true);
                    setFinishButtonDisabled(false);
                } else {
                    console.error("Failed to start bitácora:", response.statusText);
                }
            } catch (e) {
                console.error("Error starting bitácora:", e);
            }
        }
    };

    const handleFinish = async () => {
        if (bitacora.status === "iniciada") {
            try {
                const response = await fetch(`${baseUrl}/bitacora/${id}/finish`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        finalMonitoreo: new Date().toISOString(), // Set the finish time
                    }),
                    credentials: "include",
                });
                if (response.ok) {
                    const updatedBitacora = await response.json();
                    setBitacora(updatedBitacora);
                    setFinishButtonDisabled(true);
                } else {
                    console.error("Failed to finish bitácora:", response.statusText);
                }
            } catch (e) {
                console.error("Error finishing bitácora:", e);
            }
        }
        if (bitacora.status === "iniciada") {
            try {
                const response = await fetch(`${baseUrl}/bitacora/${id}/status`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: "finalizada",
                        inicioMonitoreo: new Date().toISOString(), // Set the start time
                    }),
                    credentials: "include",
                });
                if (response.ok) {
                    const updatedBitacora = await response.json();
                    setBitacora(updatedBitacora);
                    setIsEventStarted(true);
                    setFinishButtonDisabled(false);
                } else {
                    console.error("Failed to start bitácora:", response.statusText);
                }
            } catch (e) {
                console.error("Error starting bitácora:", e);
            }
            fetchBitacora();
        }

        fetchBitacora();
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setNewEvent((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/bitacora/${id}/event`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newEvent.name, // Ensure this matches the backend field
                    descripcion: newEvent.details,
                    ubicacion: newEvent.ubicacion,
                    duracion: newEvent.duracion,
                    distancia: newEvent.distancia,
                }),
                credentials: "include",
            });
            if (response.ok) {
                const updatedBitacora = await response.json();
                setBitacora(updatedBitacora);
                setNewEvent({
                    name: "",
                    details: "",
                    ubicacion: "",
                    duracion: "",
                    distancia: "",
                });
                window.bootstrap.Modal.getInstance(document.getElementById("eventModal")).hide();
            } else {
                console.error("Failed to add event:", response.statusText);
            }
        } catch (e) {
            console.error("Error adding event:", e);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Fecha inválida";

        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
            timeZoneName: "short",
        };
        return date.toLocaleString("es-ES", options);
    };

    if (!bitacora) {
        return <div>Loading...</div>;
    }

    const EventCard = ({name, details, ubicacion, duracion, distancia, createdAt}) => (
        <div className="card mb-3">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <h5 className="card-title">{name}</h5>
                        <p className="card-text">
                            <strong>Detalles:</strong> {details}
                        </p>
                        <p className="card-text">
                            <strong>Fecha:</strong> {new Date(createdAt).toLocaleDateString()}
                        </p>
                        <p className="card-text">
                            <strong>Hora:</strong> {new Date(createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                    <div className="col-md-6">
                        <p className="card-text">
                            <strong>Ubicación:</strong> {ubicacion}
                        </p>
                        <p className="card-text">
                            <strong>Duración:</strong> {duracion}
                        </p>
                        <p className="card-text">
                            <strong>Distancia:</strong> {distancia}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const events = Array.isArray(bitacora.eventos) ? bitacora.eventos : [];

    return (
        <section id="bitacoraDetail">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-[15%]">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <h1 className="fs-3 fw-semibold text-black d-flex align-items-center">
                            Detalles
                        </h1>
                    </div>

                    <div className="card-body">
                        <div className="row">
                            {/* Column 1 */}
                            <div className="col-md-4">
                                <h6 className="card-subtitle mb-2">
                                    <strong>ID Cliente:</strong> {bitacora.cliente}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Cliente:</strong> {bitacora.cliente}
                                </h6>
                            </div>

                            {/* Column 2 */}
                            <div className="col-md-4">
                                <h6 className="card-subtitle mb-2">
                                    <strong>Monitoreo:</strong> {bitacora.monitoreo}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Operador:</strong> {bitacora.operador}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>ECO Tracto:</strong> {bitacora.eco_tracto}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Placa Tracto:</strong> {bitacora.placa_tracto}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>ECO Remolque:</strong> {bitacora.eco_remolque}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Placa Remolque:</strong> {bitacora.placa_remolque}
                                </h6>
                            </div>

                            {/* Column 3 */}
                            <div className="col-md-4">
                                <h6 className="card-subtitle mb-2">
                                    <strong>Origen:</strong> {bitacora.origen}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Destino:</strong> {bitacora.destino}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Enlace:</strong> {bitacora.enlace}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>ID Acceso:</strong> {bitacora.id_acceso}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Contraseña Acceso:</strong> {bitacora.contra_acceso}
                                </h6>
                            </div>
                        </div>

                        {/* New Row for Inicio Monitoreo, Final Monitoreo, and Iniciar button */}
                        <div className="row mt-3 mx-1">
                            <div className="col-md-5">
                                <p className="card-text mb-2">
                                    <strong>Inicio Monitoreo:</strong>{" "}
                                    {bitacora.inicioMonitoreo
                                        ? formatDate(bitacora.inicioMonitoreo)
                                        : "--"}
                                </p>
                            </div>
                            <div className="col-md-5">
                                <p className="card-text mb-2">
                                    <strong>Final Monitoreo:</strong>{" "}
                                    {bitacora.finalMonitoreo
                                        ? formatDate(bitacora.finalMonitoreo)
                                        : "--"}
                                </p>
                            </div>
                            <div className="col-md-2 d-flex justify-content-end align-items-center">
                                <button
                                    className={`btn ${
                                        bitacora.status === "iniciada"
                                            ? "btn-danger"
                                            : "btn-success"
                                    } ${finishButtonDisabled ? "disabled" : ""}`}
                                    onClick={
                                        bitacora.status === "iniciada" ? handleFinish : handleStart
                                    }
                                    disabled={finishButtonDisabled}>
                                    {bitacora.status === "iniciada" ? "Finalizar" : "Iniciar"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div className="container mt-4">
                        <div className="row mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <button
                                    className="btn btn-primary rounded-5"
                                    data-bs-toggle="modal"
                                    data-bs-target="#eventModal">
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                                <h1 className="text-center fs-3 fw-semibold text-black flex-grow-1">
                                    Eventos
                                </h1>
                            </div>
                        </div>
                        <div className="row">
                            {events.map((event, index) => (
                                <EventCard key={index} {...event} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {/* Bootstrap Modal for adding a new event */}
            <div
                className="modal fade"
                id="eventModal"
                tabIndex="-1"
                aria-labelledby="eventModalLabel"
                aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="eventModalLabel">
                                Añadir Evento
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Tipo de Evento
                                    </label>
                                    <select
                                        id="name"
                                        name="name"
                                        className="form-select"
                                        value={newEvent.name}
                                        onChange={handleChange}
                                        required>
                                        <option value="">Seleccionar tipo de evento</option>
                                        {eventTypes.map((eventType) => (
                                            <option key={eventType._id} value={eventType.eventType}>
                                                {eventType.eventType}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="details" className="form-label">
                                        Detalles
                                    </label>
                                    <textarea
                                        id="details"
                                        name="details"
                                        className="form-control"
                                        value={newEvent.details}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ubicacion" className="form-label">
                                        Ubicación
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ubicacion"
                                        name="ubicacion"
                                        value={newEvent.ubicacion}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="duracion" className="form-label">
                                        Duración
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="duracion"
                                        name="duracion"
                                        value={newEvent.duracion}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="distancia" className="form-label">
                                        Distancia
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="distancia"
                                        name="distancia"
                                        value={newEvent.distancia}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">
                                        Añadir Evento
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary ms-2"
                                        data-bs-dismiss="modal">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BitacoraDetail;

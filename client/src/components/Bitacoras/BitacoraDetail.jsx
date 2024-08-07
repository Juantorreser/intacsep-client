import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "../Footer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faPlus} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {Modal, Button, Form} from "react-bootstrap";

const BitacoraDetail = () => {
    const {id} = useParams();
    const {user, verifyToken, setUser} = useAuth();
    const [bitacora, setBitacora] = useState(null);
    const [isEventStarted, setIsEventStarted] = useState(false);
    const [finishButtonDisabled, setFinishButtonDisabled] = useState(true);
    const [isEdited, setIsEdited] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [edited_bitacora, setEditedBitacora] = useState({});
    const [roleData, setRoleData] = useState(null);
    const [initialized, setInitialized] = useState(false); // Track initialization
    const navigate = useNavigate();

    const [newEvent, setNewEvent] = useState({
        nombre: "",
        descripcion: "",
        ubicacion: "",
        ultimo_posicionamiento: "",
        velocidad: "",
        coordenadas: "",
        frecuencia: 0,
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
        const init = async () => {
            try {
                const data = await verifyToken(); // Ensure user is verified
                setUser(data);
                setInitialized(true); // Set initialization as complete
            } catch (e) {
                console.log("Error verifying token or fetching user:", e);
                navigate("/login");
            }
        };
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
        init();
    }, [isEdited]);

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
    }, [initialized, user]);

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
                    nombre: newEvent.nombre, // Ensure this matches the backend field
                    descripcion: newEvent.descripcion,
                    ubicacion: newEvent.ubicacion,
                    ultimo_posicionamiento: newEvent.ultimo_posicionamiento,
                    velocidad: newEvent.velocidad,
                    coordenadas: newEvent.coordenadas,
                    registrado_por: `${user.firstName} ${user.lastName}`,
                    frecuencia: newEvent.frecuencia,
                }),
                credentials: "include",
            });
            if (response.ok) {
                const updatedBitacora = await response.json();
                setBitacora(updatedBitacora);
                setNewEvent({
                    nombre: "",
                    descripcion: "",
                    ubicacion: "",
                    ultimo_posicionamiento: "",
                    velocidad: "",
                    coordenadas: "",
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

    const EventCard = ({
        nombre,
        descripcion,
        ubicacion,
        ultimo_posicionamiento,
        velocidad,
        coordenadas,
        createdAt,
        registrado_por,
        frecuencia,
    }) => (
        <div className="card mb-3">
            <div className="card-header text-center">
                <h5 className="card-title fw-semibold">{nombre}</h5>
            </div>
            <div className="card-body">
                <div className="row">
                    <div className="col-md-6">
                        <p className="card-text">
                            <strong>Registrado por:</strong> {registrado_por}
                        </p>
                        <p className="card-text">
                            <strong>Descripción:</strong> {descripcion}
                        </p>
                        <p className="card-text">
                            <strong>Frecuencia:</strong> {`${frecuencia} min`}
                        </p>
                    </div>
                    <div className="col-md-6">
                        <p className="card-text">
                            <strong>Ubicación:</strong> {ubicacion}
                        </p>
                        <p className="card-text">
                            <strong>Último Posicionamiento:</strong> {ultimo_posicionamiento}
                        </p>
                        <p className="card-text">
                            <strong>Velocidad:</strong> {velocidad}
                        </p>
                        <p className="card-text">
                            <strong>Coordenadas:</strong> {coordenadas}
                        </p>
                        <p className="card-text">
                            <strong>Fecha:</strong> {new Date(createdAt).toLocaleDateString()}
                        </p>
                        <p className="card-text">
                            <strong>Hora:</strong> {new Date(createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const events = Array.isArray(bitacora.eventos) ? bitacora.eventos : [];

    const getButtonClass = (status) => {
        switch (status) {
            case "creada":
                return "btn btn-success"; // Style for "creada"
            case "iniciada":
                return "btn btn-danger"; // Style for "iniciada"
            case "finalizada":
                return "btn btn-secondary"; // Style for "finalizada"
            case "archivada":
                return "btn btn-dark"; // Style for "archivada"
            default:
                return "btn btn-secondary"; // Default style
        }
    };

    const getButtonText = (status) => {
        switch (status) {
            case "creada":
                return "Iniciar";
            case "iniciada":
                return "Finalizar";
            case "finalizada":
                return "Cerrada";
            default:
                return "Iniciar"; // Default text
        }
    };

    const hasEventWithName = () => {
        const eventToStart = "Validación";
        const eventToFinish = "Cierre de servicio";
        if (bitacora.status === "creada") {
            return events.some((event) => event.nombre === eventToStart);
        } else if (bitacora.status === "iniciada") {
            return events.some((event) => event.nombre === eventToFinish);
        }
        return false;
    };

    const handleEditChange = (e) => {
        const {name, value} = e.target;
        const [mainKey, subKey] = name.split(".");

        setEditedBitacora((prev) => {
            if (subKey) {
                return {
                    ...prev,
                    [mainKey]: {
                        ...prev[mainKey],
                        [subKey]: value,
                    },
                };
            } else {
                return {
                    ...prev,
                    [name]: value,
                };
            }
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/bitacora/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(edited_bitacora),
                credentials: "include",
            });
            if (response.ok) {
                const updatedBitacora = await response.json();
                setBitacora(updatedBitacora);
                setIsEdited(!isEdited);
                setEditModalVisible(false);
            } else {
                console.error("Failed to edit bitácora:", response.statusText);
            }
        } catch (e) {
            console.error("Error editing bitácora:", e);
        }
    };

    return (
        <section id="bitacoraDetail">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-[15%]">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
                    <div className="d-flex justify-content-center align-items-center mb-3 ms-5 position-relative">
                        <h1 className="fs-3 fw-semibold text-black text-center position-relative">
                            Detalles
                        </h1>

                        {roleData && roleData.edit_bitacora && (
                            <button
                                className="btn btn-primary position-absolute end-0 me-3"
                                onClick={() => {
                                    setEditedBitacora(bitacora);
                                    setEditModalVisible(true);
                                }}>
                                <i className="fa fa-edit"></i>
                            </button>
                        )}
                    </div>

                    <div className="card-body">
                        <div className="row ms-1">
                            {/* Column 1 */}
                            <div className="col-md-4">
                                <h6 className="card-subtitle mb-2">
                                    <strong>Folio Servicio:</strong> {bitacora.folio_servicio}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>No. Bitácora:</strong> {bitacora.bitacora_id}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Cliente:</strong> {bitacora.cliente}
                                </h6>
                                {/* <h6 className="card-subtitle mb-2">
                                    <strong>ID Cliente:</strong> {cliente.ID_Cliente}
                                </h6> */}
                                <h6 className="card-subtitle mb-2">
                                    <strong>Tipo Monitoreo:</strong> {bitacora.monitoreo}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Operador:</strong> {bitacora.operador}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Teléfono:</strong> {bitacora.telefono}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Linea Transporte:</strong> {bitacora.linea_transporte}
                                </h6>
                            </div>

                            {/* Column 2 */}
                            <div className="col-md-2">
                                <h5 className="card-subtitle mb-2 fw-semibold">Tracto:</h5>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Eco:</strong> {bitacora.tracto.eco}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Placa:</strong> {bitacora.tracto.placa}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Marca:</strong> {bitacora.tracto.marca}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Modelo:</strong> {bitacora.tracto.modelo}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Color:</strong> {bitacora.tracto.color}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Tipo:</strong> {bitacora.tracto.tipo}
                                </h6>
                            </div>
                            {/* Column 3 */}
                            <div className="col-md-3">
                                <h5 className="card-subtitle mb-2 fw-semibold">Remolque:</h5>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Eco:</strong> {bitacora.remolque.eco}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Placa:</strong> {bitacora.remolque.placa}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Color:</strong> {bitacora.remolque.color}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Capacidad:</strong> {bitacora.remolque.capacidad}
                                </h6>
                                <h6 className="card-subtitle mb-2">
                                    <strong>Sello:</strong> {bitacora.remolque.sello}
                                </h6>
                            </div>

                            {/* Column 4 */}
                            <div className="col-md-3">
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
                        <hr />
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
                                    id="iniciarBtn"
                                    className={getButtonClass(bitacora.status)}
                                    onClick={
                                        bitacora.status === "iniciada" ? handleFinish : handleStart
                                    }
                                    disabled={!hasEventWithName()}>
                                    {getButtonText(bitacora.status)}
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
                                    data-bs-target="#eventModal"
                                    disabled={
                                        bitacora.status === "finalizada" ||
                                        bitacora.status === "archivada"
                                    }>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>

                                <h1 className="text-center fs-3 fw-semibold text-black flex-grow-1 me-5">
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
                                    <label htmlFor="nombre" className="form-label">
                                        Tipo de Evento
                                    </label>
                                    <select
                                        id="nombre"
                                        name="nombre"
                                        className="form-select"
                                        value={newEvent.nombre}
                                        onChange={handleChange}
                                        required>
                                        <option value="">Seleccionar tipo de evento</option>
                                        {bitacora.status === "creada" ? (
                                            <option value="Validación">Validación</option>
                                        ) : (
                                            eventTypes.map((eventType) => (
                                                <option
                                                    key={eventType._id}
                                                    value={eventType.eventType}>
                                                    {eventType.eventType}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="descripcion" className="form-label">
                                        Descripcion
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        className="form-control"
                                        value={newEvent.descripcion}
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
                                    <label htmlFor="ultimo_posicionamiento" className="form-label">
                                        Último Posicionamiento
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ultimo_posicionamiento"
                                        name="ultimo_posicionamiento"
                                        value={newEvent.ultimo_posicionamiento}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="velocidad" className="form-label">
                                        Velocidad
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="velocidad"
                                        name="velocidad"
                                        value={newEvent.velocidad}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="coordenadas" className="form-label">
                                        Coordenadas
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="coordenadas"
                                        name="coordenadas"
                                        value={newEvent.coordenadas}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="frecuencia" className="form-label">
                                        Frecuencia
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        max="99"
                                        id="frecuencia"
                                        name="frecuencia"
                                        value={newEvent.frecuencia}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="text-end">
                                    <button
                                        type="button"
                                        className="btn btn-danger m-2"
                                        data-bs-dismiss="modal">
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        data-bs-dismiss="modal">
                                        Registrar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {editModalVisible && (
                <>
                    <Modal
                        show={editModalVisible}
                        onHide={() => setEditModalVisible(false)}
                        backdrop="static"
                        keyboard={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>Editar Bitácora</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleEditSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="folio_servicio">
                                        Folio de servicio
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="folio_servicio"
                                        name="folio_servicio"
                                        value={edited_bitacora.folio_servicio}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                {/* cliente */}
                                {/* monitoreo */}
                                {/* operador */}
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="telefono">Telefono</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={edited_bitacora.telefono}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="linea_transporte">
                                        Línea de transporte
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="linea_transporte"
                                        name="linea_transporte"
                                        value={edited_bitacora.linea_transporte}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                {/* origen */}
                                {/* destino */}
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="enlace">Enlace</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="enlace"
                                        name="enlace"
                                        value={edited_bitacora.enlace}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="id_acceso">ID acceso</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="id_acceso"
                                        name="id_acceso"
                                        value={edited_bitacora.id_acceso}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="contra_acceso">
                                        Contraseña acceso
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="contra_acceso"
                                        name="contra_acceso"
                                        value={edited_bitacora.contra_acceso}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                {/* TRACTO */}
                                <hr />
                                <h5 className="mb-2">Tracto</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="tracto.eco">ECO</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="tracto.eco"
                                        name="tracto.eco"
                                        value={edited_bitacora.tracto.eco}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="tracto.placa">Placa</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="tracto.placa"
                                        name="tracto.placa"
                                        value={edited_bitacora.tracto.placa}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="tracto.marca">Marca</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="tracto.marca"
                                        name="tracto.marca"
                                        value={edited_bitacora.tracto.marca}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="tracto.modelo">Modelo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="tracto.modelo"
                                        name="tracto.modelo"
                                        value={edited_bitacora.tracto.modelo}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="tracto.color">Color</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="tracto.color"
                                        name="tracto.color"
                                        value={edited_bitacora.tracto.color}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="tracto.tipo">Tipo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="tracto.tipo"
                                        name="tracto.tipo"
                                        value={edited_bitacora.tracto.tipo}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                {/* REMOLQUE */}
                                <hr />
                                <h5 className="mb-2">Remolque</h5>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="remolque.eco">ECO</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="remolque.eco"
                                        name="remolque.eco"
                                        value={edited_bitacora.remolque.eco}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="remolque.placa">Placa</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="remolque.placa"
                                        name="remolque.placa"
                                        value={edited_bitacora.remolque.placa}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="remolque.color">Color</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="remolque.color"
                                        name="remolque.color"
                                        value={edited_bitacora.remolque.color}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="remolque.capacidad">Capacidad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="remolque.capacidad"
                                        name="remolque.capacidad"
                                        value={edited_bitacora.remolque.capacidad}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="remolque.sello">Sello</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="remolque.sello"
                                        name="remolque.sello"
                                        value={edited_bitacora.remolque.sello}
                                        onChange={handleEditChange}
                                    />
                                </Form.Group>
                                <div className="w-100 d-flex flex-row justify-content-end">
                                    <Button type="submit" variant="success" className="ms-auto">
                                        Guardar
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </section>
    );
};

export default BitacoraDetail;

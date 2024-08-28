import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faPlus} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../../context/AuthContext";
import {Modal, Button, Form, Row} from "react-bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import TransporteDetails from "./TransporteDetails";

const CreateTransporteModal = ({show, handleClose, addTransporte, transportes}) => {
    const [transporteData, setTransporteData] = useState({
        id: transportes.length + 1,
        tracto: {
            eco: "",
            placa: "",
            marca: "",
            modelo: "",
            color: "",
            tipo: "",
        },
        remolque: {
            eco: "",
            placa: "",
            color: "",
            capacidad: "",
            sello: "",
        },
    });

    // Handle form input changes
    const handleChange = (e) => {
        const {name, value} = e.target;
        const [section, field] = name.split(".");
        if (section && field) {
            setTransporteData((prevData) => ({
                ...prevData,
                [section]: {
                    ...prevData[section],
                    [field]: value,
                },
            }));
        } else {
            setTransporteData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // Handle form submission
    const handleSubmitTransporte = (e) => {
        e.preventDefault();
        addTransporte(transporteData);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Crear Nuevo Transporte</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitTransporte}>
                    <Form.Group className="mb-3">
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                            type="number"
                            name="id"
                            value={transportes.length + 1}
                            onChange={handleChange}
                            required
                            disabled
                        />
                    </Form.Group>

                    {/* Tracto Fields */}
                    <h5>Tracto</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Eco</Form.Label>
                        <Form.Control
                            type="text"
                            name="tracto.eco"
                            value={transporteData.tracto.eco}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Placa</Form.Label>
                        <Form.Control
                            type="text"
                            name="tracto.placa"
                            value={transporteData.tracto.placa}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Marca</Form.Label>
                        <Form.Control
                            type="text"
                            name="tracto.marca"
                            value={transporteData.tracto.marca}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Modelo</Form.Label>
                        <Form.Control
                            type="text"
                            name="tracto.modelo"
                            value={transporteData.tracto.modelo}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Color</Form.Label>
                        <Form.Control
                            type="text"
                            name="tracto.color"
                            value={transporteData.tracto.color}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control
                            type="text"
                            name="tracto.tipo"
                            value={transporteData.tracto.tipo}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* Remolque Fields */}
                    <h5>Remolque</h5>
                    <Form.Group className="mb-3">
                        <Form.Label>Eco</Form.Label>
                        <Form.Control
                            type="text"
                            name="remolque.eco"
                            value={transporteData.remolque.eco}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Placa</Form.Label>
                        <Form.Control
                            type="text"
                            name="remolque.placa"
                            value={transporteData.remolque.placa}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Color</Form.Label>
                        <Form.Control
                            type="text"
                            name="remolque.color"
                            value={transporteData.remolque.color}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Capacidad</Form.Label>
                        <Form.Control
                            type="text"
                            name="remolque.capacidad"
                            value={transporteData.remolque.capacidad}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Sello</Form.Label>
                        <Form.Control
                            type="text"
                            name="remolque.sello"
                            value={transporteData.remolque.sello}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <div className="d-flex w-100 justify-content-end">
                        <button
                            type="cancel"
                            className="btn btn-danger px-3 me-3"
                            onClick={handleClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-success px-4">
                            Crear
                        </button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

const BitacoraDetail = ({edited}) => {
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
    const [origenes, setOrigenes] = useState([]);
    const [destinos, setDestinos] = useState([]);
    const [operadores, setOperadores] = useState([]);
    const [clients, setClients] = useState([]);
    const [monitoreos, setMonitoreos] = useState([]);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("detalles");
    const [selectedTransporte, setSelectedTransporte] = useState(null);
    const [transportes, setTransportes] = useState(bitacora?.transportes || []);
    const [showModal, setShowModal] = useState(false);
    const [isEditTransporteModalVisible, setEditTransporteModalVisible] = useState(false);
    const [editedTransporte, setEditedTransporte] = useState(null);
    const [selectedTransportes, setSelectedTransportes] = useState([]);

    const handleEditTransporte = () => {
        setEditedTransporte(selectedTransporte);
        setEditTransporteModalVisible(true);
    };

    //TRANSPORTES LOGIC
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const handleSelectTransporte = (transporte) => {
        setSelectedTransporte(transporte);
    };

    const handleTransportEdit = (e) => {
        e.preventDefault();
        console.log("TRANSPORT EDIT");

        // Find the index of the transporte by its ID
        const index = edited_bitacora.transportes.findIndex(
            (transporte) => transporte.id === editedTransporte.id
        );

        if (index > -1) {
            // Update the specific transporte in the transportes array
            const updatedTransportes = [...edited_bitacora.transportes];
            updatedTransportes[index] = editedTransporte;

            // Update edited_bitacora with the modified transportes array
            setEditedBitacora((prev) => ({
                ...prev,
                transportes: updatedTransportes,
            }));

            if (edited_bitacora) {
                edited_bitacora.transportes = updatedTransportes;
            }

            console.log(edited_bitacora);

            // Call the original handleEditSubmit function
            handleEditSubmit(e);
            setEditTransporteModalVisible(false);
        } else {
            console.error("Transporte not found");
        }
    };

    const addTransporte = async (newTransporte) => {
        try {
            const response = await fetch(`${baseUrl}/bitacoras/${bitacora._id}/transportes`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTransporte),
            });

            if (!response.ok) {
                throw new Error("Failed to add transporte");
            }

            const updatedBitacora = await response.json();

            // Assuming the updatedBitacora contains the updated transportes array
            setTransportes(updatedBitacora.transportes);
            fetchBitacora();
        } catch (error) {
            console.error("Error adding transporte:", error);
        }
    };

    useEffect(() => {
        console.log(edited_bitacora);
    }, [edited_bitacora]);

    //TABS
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

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

    const fetchClients = async () => {
        try {
            const response = await fetch(`${baseUrl}/clients`);
            if (response.ok) {
                const data = await response.json();
                setClients(data);
            } else {
                console.error("Failed to fetch clients:", response.statusText);
            }
        } catch (e) {
            console.error("Error fetching clients:", e);
        }
    };

    const fetchMonitoreos = async () => {
        try {
            const response = await fetch(`${baseUrl}/monitoreos`);
            if (response.ok) {
                const data = await response.json();
                setMonitoreos(data);
            } else {
                console.error("Failed to fetch monitoreos:", response.statusText);
            }
        } catch (e) {
            console.error("Error fetching monitoreos:", e);
        }
    };

    const fetchOrigenes = async () => {
        try {
            const response = await fetch(`${baseUrl}/origenes`);
            if (response.ok) {
                const data = await response.json();
                setOrigenes(data);
            } else {
                console.error("Failed to fetch origenes:", response.statusText);
            }
        } catch (e) {
            console.error("Error fetching origenes:", e);
        }
    };

    const fetchDestinos = async () => {
        try {
            const response = await fetch(`${baseUrl}/destinos`);
            if (response.ok) {
                const data = await response.json();
                setDestinos(data);
            } else {
                console.error("Failed to fetch destinos:", response.statusText);
            }
        } catch (e) {
            console.error("Error fetching destinos:", e);
        }
    };

    const fetchOperadores = async () => {
        try {
            const response = await fetch(`${baseUrl}/operadores`);
            if (response.ok) {
                const data = await response.json();
                setOperadores(data);
            } else {
                console.error("Failed to fetch operadores:", response.statusText);
            }
        } catch (e) {
            console.error("Error fetching operadores:", e);
        }
    };

    const fetchBitacora = async () => {
        try {
            const response = await fetch(`${baseUrl}/bitacora/${id}`);
            if (response.ok) {
                const data = await response.json();

                if (edited || edited.edited) {
                    setBitacora(data.edited_bitacora);
                    setEditedBitacora(data.edited_bitacora);
                    setTransportes(data.edited_bitacora.transportes);
                    console.log("EDITADA");
                } else if (!edited && data.edited_bitacora) {
                    console.log("REGULAR PAGE pero tiene edited_btacora");
                    setBitacora(data);
                    setEditedBitacora(data.edited_bitacora);
                    setTransportes(data.transportes);
                } else {
                    console.log("REGULAR PAGE pero NO tiene edited_btacora");
                    setBitacora(data);
                    setEditedBitacora(data);
                    setTransportes(data.transportes);
                }
                setIsEventStarted(data.status === "iniciada");
                setFinishButtonDisabled(data.status === "finalizada");
                setFinishButtonDisabled(data.status === "cerrada");
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

        fetchClients();
        fetchOperadores();
        fetchOrigenes();
        fetchMonitoreos();
        fetchDestinos();
        fetchBitacora();
        fetchEventTypes();
        init();
    }, []);

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
        if (bitacora.status === "validada") {
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
        if (bitacora.status === "validada") {
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
                        status: "cerrada",
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
        console.log(selectedTransportes);

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
                    transportes: selectedTransportes,
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

                if (bitacora.status === "nueva" && newEvent.nombre === "Validación") {
                    try {
                        const response = await fetch(`${baseUrl}/bitacora/${id}/status`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                status: "validada",
                                inicioMonitoreo: new Date().toISOString(), // Set the start time
                            }),
                            credentials: "include",
                        });
                        if (response.ok) {
                            const updatedBitacora = await response.json();
                            setBitacora(updatedBitacora);
                        } else {
                            console.error("Failed to start bitácora:", response.statusText);
                        }
                    } catch (e) {
                        console.error("Error starting bitácora:", e);
                    }
                }
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

    const EventCard = ({event, eventos}) => {
        const {
            _id,
            nombre,
            descripcion,
            ubicacion,
            ultimo_posicionamiento,
            velocidad,
            coordenadas,
            createdAt,
            registrado_por,
            frecuencia,
        } = event;
        const [showModal, setShowModal] = useState(false);
        const [formData, setFormData] = useState({
            nombre,
            registrado_por,
            descripcion,
            ubicacion,
            ultimo_posicionamiento,
            velocidad,
            coordenadas,
            frecuencia,
            createdAt,
        });

        const isLastEvent = events[events.length - 1] === event;

        const handleEditClick = () => setShowModal(true);
        const handleClose = () => setShowModal(false);

        const handleInputChange = (e) => {
            const {name, value} = e.target;
            setFormData({...formData, [name]: value});
        };

        const handleFormSubmit = async (e) => {
            e.preventDefault();
            // console.log(formData);
            if (edited_bitacora) {
                edited_bitacora.eventos.forEach((evento, i) => {
                    if (evento.nombre === formData.nombre) {
                        formData.createdAt = edited_bitacora.eventos[i].createdAt;
                        edited_bitacora.eventos[i] = formData;
                    }
                });
            }

            handleEditSubmit(e);
        };

        return (
            <div className="card mb-3">
                <div className="card-header text-center pt-3">
                    <h5 className="card-title fw-semibold">{nombre}</h5>
                    <Button
                        variant="primary"
                        onClick={handleEditClick}
                        className="position-absolute end-0 top-0 mt-2 me-3 btn"
                        disabled={
                            !(
                                (roleData &&
                                    roleData.edit_eventos_a &&
                                    bitacora.status !== "cerrada") ||
                                (roleData &&
                                    roleData.edit_eventos_c &&
                                    bitacora.status === "cerrada")
                            )
                        }>
                        <i className="fa fa-edit"></i>
                    </Button>
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
                            <div className="d-flex align-items-start gap-2">
                                <strong>Frecuencia: </strong>
                                <p> {`${frecuencia}  min`} </p>
                                {isLastEvent && (
                                    <div className="semaforoEvent">
                                        {getEventColor(bitacora).map((color, index) => (
                                            <div
                                                key={index}
                                                className={`circle`}
                                                style={{
                                                    backgroundColor: color,
                                                }}></div>
                                        ))}
                                    </div>
                                )}
                            </div>
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

                {/* Edit Modal */}
                <Modal show={showModal} onHide={handleClose} backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Evento</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Registrado Por</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.registrado_por}
                                    onChange={handleInputChange}
                                    disabled
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Ubicación</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ubicacion"
                                    value={formData.ubicacion}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Último Posicionamiento</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ultimo_posicionamiento"
                                    value={formData.ultimo_posicionamiento}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Velocidad</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="velocidad"
                                    value={formData.velocidad}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Coordenadas</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="coordenadas"
                                    value={formData.coordenadas}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Frecuencia</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="frecuencia"
                                    value={formData.frecuencia}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Row className="justify-content-end">
                                <Button
                                    type="button"
                                    className="btn btn-danger me-2 col-2"
                                    onClick={handleClose} // This line is added
                                >
                                    Cancelar
                                </Button>

                                <Button variant="success" type="submit" className="col-2 me-2">
                                    Guardar
                                </Button>
                            </Row>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    };

    const events = Array.isArray(bitacora.eventos) ? bitacora.eventos : [];

    const getButtonClass = (status) => {
        switch (status) {
            case "nueva":
                return "btn btn-secondary"; // Style for "nueva"
            case "validada":
                return "btn btn-success"; // Style for "validada"
            case "iniciada":
                return "btn btn-danger"; // Style for "iniciada"
            case "finalizada":
                return "btn btn-secondary"; // Style for "finalizada"
            case "cerrada":
                return "btn btn-dark"; // Style for "cerrada"
            default:
                return "btn btn-secondary"; // Default style
        }
    };

    const getButtonText = (status) => {
        switch (status) {
            case "nueva":
                return "Iniciar";
            case "validada":
                return "Iniciar";
            case "iniciada":
                return "Finalizar";
            case "finalizada":
                return "Cerrada";
            case "cerrada":
                return "Cerrada";
            default:
                return "Iniciar"; // Default text
        }
    };

    const hasEventWithName = () => {
        const eventToStart = "Validación";
        const eventToFinish = "Cierre de servicio";
        if (bitacora.status === "validada") {
            return events.some((event) => event.nombre === eventToStart);
        } else if (bitacora.status === "iniciada") {
            return events.some((event) => event.nombre === eventToFinish);
        }
        return false;
    };

    const handleEditChange = (e) => {
        const {name, value, type} = e.target;

        // Handle change for select fields
        if (type === "select-one") {
            setEditedBitacora((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            // Handle change for input fields
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
        }
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
                // console.log(updatedBitacora);

                setBitacora(updatedBitacora);
                setIsEdited(true);
                setEditModalVisible(false);
            } else {
                console.error("Failed to edit bitácora:", response.statusText);
            }
        } catch (e) {
            console.error("Error editing bitácora:", e);
        }

        try {
            const response = await fetch(`${baseUrl}/bitacora/${id}/edited`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    edited: true,
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
    };

    const getEventColor = (bitacora) => {
        if (bitacora.status != "iniciada" && bitacora.status != "validada") {
            return ["#333235"]; // No events
        }

        const latestEvent = bitacora.eventos.reduce((latest, current) =>
            new Date(latest.createdAt) > new Date(current.createdAt) ? latest : current
        );

        const frecuencia = latestEvent.frecuencia;
        if (!frecuencia) return ["#333235"]; // No frecuencia

        const frecuenciaMs = frecuencia * 60000; // Convert minutes to milliseconds
        const eventTimeMs = new Date(latestEvent.createdAt).getTime();
        const currentTimeMs = new Date().getTime();
        const elapsedTimeMs = currentTimeMs - eventTimeMs;

        const greenColor = "#51FF4E"; // Green
        const greenColor2 = "#3DDC3B"; // Green
        const greenColor3 = "#3C933B"; // Green
        const yellowColor = "#ECEC27"; // Yellow
        const yellowColor2 = "#D8D811"; // Yellow
        const yellowColor3 = "#ACAC2A"; // Yellow
        const redColor = "#F82929"; // Red
        const redColor2 = "#B82F2F"; // Red
        const redColor3 = "#883B3B"; // Red

        // Determine the color
        if (elapsedTimeMs < frecuenciaMs) {
            const threshold = frecuenciaMs * 0.75; // 75% of the frecuencia
            if (elapsedTimeMs < threshold) {
                return [greenColor]; // Green
            } else {
                return [yellowColor]; // Yellow
            }
        } else {
            return [redColor]; // Red
        }
    };

    const handleSelectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        if (selectedOptions.includes("all")) {
            if (selectedTransportes.length === bitacora.transportes.length) {
                setSelectedTransportes([]);
            } else {
                setSelectedTransportes(bitacora.transportes.map((t) => t.id));
            }
        } else {
            setSelectedTransportes(selectedOptions);
        }
    };

    // const handleSelectAll = (e) => {
    //     if (selectedTransportes.length === bitacora.transportes.length) {
    //         setSelectedTransportes([]);
    //     } else {
    //         setSelectedTransportes(bitacora.transportes.map((t) => t.id));
    //     }
    // };

    const handleCheckboxChange = (e) => {
        const {value, checked} = e.target;

        if (value === "all") {
            // Handle "All" selection
            if (checked) {
                setSelectedTransportes(bitacora.transportes.map((t) => t.id));
            } else {
                setSelectedTransportes([]);
            }
        } else {
            // Handle individual selections
            if (checked) {
                setSelectedTransportes((prev) => [...prev, value]);
            } else {
                setSelectedTransportes((prev) => prev.filter((id) => id !== value));
            }
        }
    };

    const handleSelectAll = () => {
        if (selectedTransportes.length === bitacora.transportes.length) {
            setSelectedTransportes([]);
        } else {
            setSelectedTransportes(bitacora.transportes.map((t) => t.id));
        }
    };

    return (
        <section id="bitacoraDetail">
            <Header />
            <div className="w-100 d-flex">
                <div className="sidebar-wrapper">
                    <Sidebar />
                </div>
                <div className="content-wrapper">
                    <div
                        id="detailHeader"
                        className="d-flex justify-content-center align-items-center position-relative">
                        <div
                            className="position-absolute start-0 ms-2 btn"
                            onClick={() => navigate("/bitacoras")}>
                            <i className="fa fa-chevron-left fw-bold"></i>
                        </div>
                        {/* Tab Navigation */}
                        <ul className="nav nav-tabs" id="bitacoraTabs" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link active"
                                    id="detalles-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#detalles"
                                    type="button"
                                    role="tab"
                                    aria-controls="detalles"
                                    aria-selected="true"
                                    onClick={() => handleTabClick("detalles")}>
                                    Detalles
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="eventos-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#eventos"
                                    type="button"
                                    role="tab"
                                    aria-controls="eventos"
                                    aria-selected="false"
                                    onClick={() => handleTabClick("eventos")}>
                                    Eventos
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="transportes-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#transportes"
                                    type="button"
                                    role="tab"
                                    aria-controls="transportes"
                                    aria-selected="false"
                                    onClick={() => handleTabClick("transportes")}>
                                    Transportes
                                </button>
                            </li>
                        </ul>

                        {/* Conditional Buttons */}
                        {/* DETALLES BTN */}
                        {activeTab === "detalles" &&
                            roleData &&
                            ((roleData.edit_bitacora_abierta && bitacora.status !== "cerrada") ||
                                (bitacora.status === "cerrada" &&
                                    roleData.edit_bitacora_cerrada)) && (
                                <button
                                    className="btn btn-primary position-absolute end-0 me-4"
                                    onClick={() => {
                                        setEditModalVisible(true);
                                    }}>
                                    <i className="fa fa-edit"></i>
                                </button>
                            )}
                        {/* EVENTOS BTN */}
                        {activeTab === "eventos" && (
                            <button
                                className="btn btn-primary rounded-5 position-absolute end-0 me-4"
                                data-bs-toggle="modal"
                                data-bs-target="#eventModal"
                                disabled={bitacora.status === "cerrada"}>
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        )}
                        {/* TRANSPORTES BTN */}
                        {activeTab === "transportes" && (
                            <div className="d-flex justify-content-between align-items-center">
                                <button
                                    variant="primary"
                                    onClick={handleShow}
                                    className="btn btn-primary rounded-5 position-absolute end-0 me-4">
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="scrollable-content flex-grow-1 overflow-auto px-3">
                        <div className="tab-content" id="bitacoraTabsContent">
                            {/* Detalles Tab Content */}
                            <div
                                className="tab-pane fade show active mt-4 mx-4"
                                id="detalles"
                                role="tabpanel"
                                aria-labelledby="detalles-tab">
                                <div className="card-body">
                                    <div className="row ms-1">
                                        {/* Column 1 */}
                                        <div className="col-md-6">
                                            <h6 className="card-subtitle mb-2">
                                                <strong>Folio Servicio:</strong>{" "}
                                                {bitacora.folio_servicio}
                                            </h6>
                                            <h6 className="card-subtitle mb-2">
                                                <strong>No. Bitácora:</strong>{" "}
                                                {bitacora.bitacora_id}
                                            </h6>
                                            <h6 className="card-subtitle mb-2">
                                                <strong>Cliente:</strong> {bitacora.cliente}
                                            </h6>
                                            {/* <h6 className="card-subtitle mb-2">
                                    <strong>ID Cliente:</strong> {cliente.ID_Cliente}
                                </h6> */}
                                            <h6 className="card-subtitle mb-2">
                                                <strong>Tipo Monitoreo:</strong>{" "}
                                                {bitacora.monitoreo}
                                            </h6>
                                            <h6 className="card-subtitle mb-2">
                                                <strong>Operador:</strong> {bitacora.operador}
                                            </h6>
                                            <h6 className="card-subtitle mb-2">
                                                <strong>Teléfono:</strong> {bitacora.telefono}
                                            </h6>
                                            <h6 className="card-subtitle mb-2">
                                                <strong>Linea Transporte:</strong>{" "}
                                                {bitacora.linea_transporte}
                                            </h6>
                                        </div>

                                        {/* Column 4 */}
                                        <div className="col-md-6">
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
                                                <strong>Contraseña Acceso:</strong>{" "}
                                                {bitacora.contra_acceso}
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
                                                    bitacora.status === "iniciada"
                                                        ? handleFinish
                                                        : handleStart
                                                }
                                                disabled={!hasEventWithName()}>
                                                {getButtonText(bitacora.status)}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Eventos Tab Content */}
                            <div
                                className="tab-pane fade"
                                id="eventos"
                                role="tabpanel"
                                aria-labelledby="eventos-tab">
                                <div className="container mt-4">
                                    <div className="">
                                        {events.map((event, index) => (
                                            <EventCard key={index} event={event} eventos={events} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Transportes Tab Content */}
                            <div
                                className="tab-pane fade"
                                id="transportes"
                                role="tabpanel"
                                aria-labelledby="transportes-tab">
                                <div className="d-flex mt-4">
                                    {/* Left Side: List of Transporte IDs */}
                                    <div className="col-md-4 border-end pe-3">
                                        <h5 className="fw-semibold">Lista de Transportes</h5>
                                        <ul className="list-group">
                                            {bitacora.transportes.map((transporte) => (
                                                <li
                                                    key={transporte.id}
                                                    className={`list-group-item mt-2 ${
                                                        selectedTransporte?.id === transporte.id
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleSelectTransporte(transporte)
                                                    }
                                                    style={{cursor: "pointer"}}>
                                                    Transporte ID: {transporte.id}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Right Side: Selected Transporte Details */}
                                    <div className="col-md-8 ps-3">
                                        {selectedTransporte ? (
                                            <>
                                                <div className="d-flex justify-content-end mt-3 me-4 position-absolute end-0 ">
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={handleEditTransporte}>
                                                        <i className="fa fa-edit"></i>
                                                    </button>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-md-6">
                                                        <h5 className="card-subtitle mb-2 fw-semibold">
                                                            Tracto:
                                                        </h5>
                                                        <h6 className="card-subtitle mb-2">
                                                            <strong>Eco:</strong>{" "}
                                                            {selectedTransporte.tracto.eco}
                                                        </h6>
                                                        <h6 className="card-subtitle mb-2">
                                                            <strong>Placa:</strong>{" "}
                                                            {selectedTransporte.tracto.placa}
                                                        </h6>
                                                        <h6 className="card-subtitle mb-2">
                                                            <strong>Marca:</strong>{" "}
                                                            {selectedTransporte.tracto.marca}
                                                        </h6>
                                                        <h6 className="card-subtitle mb-2">
                                                            <strong>Modelo:</strong>{" "}
                                                            {selectedTransporte.tracto.modelo}
                                                        </h6>
                                                        <h6 className="card-subtitle mb-2">
                                                            <strong>Color:</strong>{" "}
                                                            {selectedTransporte.tracto.color}
                                                        </h6>
                                                        <h6 className="card-subtitle mb-2">
                                                            <strong>Tipo:</strong>{" "}
                                                            {selectedTransporte.tracto.tipo}
                                                        </h6>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h5 className="card-subtitle mb-2 fw-semibold">
                                                            Remolque:
                                                        </h5>
                                                        <h6 className="card-subtitle mb-2">
                                                            <strong>Eco:</strong>{" "}
                                                            {selectedTransporte.remolque.eco}
                                                        </h6>
                                                        <h6 className="card-subtitle mb-2">
                                                            <strong>Placa:</strong>{" "}
                                                            {selectedTransporte.remolque.placa}
                                                        </h6>
                                                        <h6 className="card-subtitle mb-2">
                                                            <strong>Color:</strong>{" "}
                                                            {selectedTransporte.remolque.color}
                                                        </h6>
                                                        <h6 className="card-subtitle mb-2">
                                                            <strong>Capacidad:</strong>{" "}
                                                            {selectedTransporte.remolque.capacidad}
                                                        </h6>
                                                        <h6 className="card-subtitle mb-2">
                                                            <strong>Sello:</strong>{" "}
                                                            {selectedTransporte.remolque.sello}
                                                        </h6>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="alert alert-info" role="alert">
                                                Seleccione un transporte de la lista para ver los
                                                detalles.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
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
                                    <label htmlFor="transportes" className="form-label">
                                        Transportes
                                    </label>
                                    <div>
                                        <input
                                            type="checkbox"
                                            id="allTransportes"
                                            name="transportes"
                                            value="all"
                                            onChange={handleSelectAll}
                                            checked={
                                                selectedTransportes.length ===
                                                bitacora.transportes.length
                                            }
                                        />
                                        <label htmlFor="allTransportes">All</label>
                                    </div>
                                    {bitacora.transportes.map((transporte) => (
                                        <div key={transporte.id}>
                                            <input
                                                type="checkbox"
                                                id={`transporte-${transporte.id}`}
                                                name="transportes"
                                                value={transporte.id}
                                                onChange={handleCheckboxChange}
                                                checked={selectedTransportes.includes(
                                                    transporte.id.toString()
                                                )}
                                            />
                                            <label htmlFor={`transporte-${transporte.id}`}>
                                                {transporte.id}{" "}
                                                {/* Use the appropriate field for display */}
                                            </label>
                                        </div>
                                    ))}
                                </div>

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
                                        {bitacora.status === "nueva" ? (
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
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="folio_servicio">No. Bitacora</Form.Label>
                                    <Form.Control
                                        type="text"
                                        id="bitacora_id"
                                        name="bitacora_id"
                                        value={edited_bitacora.bitacora_id}
                                        onChange={handleEditChange}
                                        disabled
                                    />
                                </Form.Group>
                                {/* cliente */}
                                <div className="mb-3">
                                    <label htmlFor="cliente" className="form-label">
                                        Cliente
                                    </label>
                                    <select
                                        className="form-select"
                                        id="cliente"
                                        name="cliente"
                                        aria-label="cliente"
                                        value={edited_bitacora.cliente}
                                        onChange={handleEditChange}
                                        required>
                                        <option value="">Selecciona una opción</option>
                                        {clients.map((cliente) => (
                                            <option key={cliente._id} value={cliente.razon_social}>
                                                {cliente.razon_social}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* monitoreo */}
                                {/* Tipo de Monitoreo */}
                                <div className="mb-3">
                                    <label htmlFor="monitoreo" className="form-label">
                                        Tipo de Monitoreo
                                    </label>
                                    <select
                                        className="form-select"
                                        id="monitoreo"
                                        name="monitoreo"
                                        aria-label="Tipo de Monitoreo"
                                        value={edited_bitacora.monitoreo}
                                        onChange={handleEditChange}
                                        required>
                                        <option value="">Selecciona una opción</option>
                                        {monitoreos.map((monitoreo) => (
                                            <option
                                                key={monitoreo._id}
                                                value={monitoreo.tipoMonitoreo}>
                                                {monitoreo.tipoMonitoreo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* operador */}
                                <div className="mb-3">
                                    <label htmlFor="operador" className="form-label">
                                        Operador
                                    </label>
                                    <select
                                        className="form-select"
                                        id="operador"
                                        aria-label="operador"
                                        name="operador"
                                        value={edited_bitacora.operador}
                                        onChange={handleEditChange}
                                        required>
                                        <option value="">Selecciona una opción</option>
                                        {operadores.map((operador) => (
                                            <option key={operador._id} value={operador.name}>
                                                {operador.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

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
                                <div className="mb-3">
                                    <label htmlFor="origen" className="form-label">
                                        Origen
                                    </label>
                                    <select
                                        className="form-select"
                                        id="origen"
                                        name="origen"
                                        aria-label="origen"
                                        value={edited_bitacora.origen}
                                        onChange={handleEditChange}
                                        required>
                                        <option value="">Selecciona una opción</option>
                                        {origenes.map((origen) => (
                                            <option key={origen._id} value={origen.name}>
                                                {origen.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* destino */}
                                <div className="mb-3">
                                    <label htmlFor="destino" className="form-label">
                                        Destino
                                    </label>
                                    <select
                                        className="form-select"
                                        id="destino"
                                        name="destino"
                                        aria-label="destino"
                                        value={edited_bitacora.destino}
                                        onChange={handleEditChange}
                                        required>
                                        <option value="">Selecciona una opción</option>
                                        {destinos.map((destino) => (
                                            <option key={destino._id} value={destino.name}>
                                                {destino.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
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
                                {/* <hr />
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
                                </Form.Group> */}
                                {/* REMOLQUE */}
                                <hr />
                                {/* <h5 className="mb-2">Remolque</h5>
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
                                </Form.Group> */}
                                <div className="w-100 d-flex flex-row justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-danger me-2"
                                        data-bs-dismiss="modal"
                                        onClick={() => setEditModalVisible(false)}>
                                        Cancelar
                                    </button>
                                    <Button type="submit" variant="success" className="me-2">
                                        Guardar
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </>
            )}

            {/* EDIT TRANSPORTES */}
            {isEditTransporteModalVisible && (
                <>
                    {" "}
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal show d-block">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Transporte</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setEditTransporteModalVisible(false)}
                                    />
                                </div>
                                <div className="modal-body">
                                    {/* Form inputs for editing transporte */}
                                    <form onSubmit={handleTransportEdit}>
                                        {/* Example inputs for tracto */}
                                        <h5>Tracto</h5>
                                        <hr />
                                        <div className="mb-3">
                                            <label className="form-label">Eco</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedTransporte.tracto.eco}
                                                onChange={(e) =>
                                                    setEditedTransporte({
                                                        ...editedTransporte,
                                                        tracto: {
                                                            ...editedTransporte.tracto,
                                                            eco: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Placa</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedTransporte.tracto.placa}
                                                onChange={(e) =>
                                                    setEditedTransporte({
                                                        ...editedTransporte,
                                                        tracto: {
                                                            ...editedTransporte.tracto,
                                                            placa: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Marca</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedTransporte.tracto.marca}
                                                onChange={(e) =>
                                                    setEditedTransporte({
                                                        ...editedTransporte,
                                                        tracto: {
                                                            ...editedTransporte.tracto,
                                                            marca: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Modelo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedTransporte.tracto.modelo}
                                                onChange={(e) =>
                                                    setEditedTransporte({
                                                        ...editedTransporte,
                                                        tracto: {
                                                            ...editedTransporte.tracto,
                                                            modelo: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Color</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedTransporte.tracto.color}
                                                onChange={(e) =>
                                                    setEditedTransporte({
                                                        ...editedTransporte,
                                                        tracto: {
                                                            ...editedTransporte.tracto,
                                                            color: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Tipo</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedTransporte.tracto.tipo}
                                                onChange={(e) =>
                                                    setEditedTransporte({
                                                        ...editedTransporte,
                                                        tracto: {
                                                            ...editedTransporte.tracto,
                                                            tipo: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <hr />

                                        <h5>Remolque</h5>
                                        <hr />
                                        <div className="mb-3">
                                            <label className="form-label">Eco</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedTransporte.remolque.eco}
                                                onChange={(e) =>
                                                    setEditedTransporte({
                                                        ...editedTransporte,
                                                        remolque: {
                                                            ...editedTransporte.remolque,
                                                            eco: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Placa</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedTransporte.remolque.placa}
                                                onChange={(e) =>
                                                    setEditedTransporte({
                                                        ...editedTransporte,
                                                        remolque: {
                                                            ...editedTransporte.remolque,
                                                            placa: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Color</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedTransporte.remolque.color}
                                                onChange={(e) =>
                                                    setEditedTransporte({
                                                        ...editedTransporte,
                                                        remolque: {
                                                            ...editedTransporte.remolque,
                                                            color: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Capacidad</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedTransporte.remolque.capacidad}
                                                onChange={(e) =>
                                                    setEditedTransporte({
                                                        ...editedTransporte,
                                                        remolque: {
                                                            ...editedTransporte.remolque,
                                                            capacidad: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Sello</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editedTransporte.remolque.sello}
                                                onChange={(e) =>
                                                    setEditedTransporte({
                                                        ...editedTransporte,
                                                        remolque: {
                                                            ...editedTransporte.remolque,
                                                            sello: e.target.value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <button
                                                type="cancel"
                                                className="btn btn-danger me-3"
                                                onClick={() =>
                                                    setEditTransporteModalVisible(false)
                                                }>
                                                Cancelar
                                            </button>
                                            <button type="submit" className="btn btn-success">
                                                Guardar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* CREATE TRASNPORTES */}
            <CreateTransporteModal
                show={showModal}
                handleClose={handleClose}
                addTransporte={addTransporte}
                transportes={transportes}
            />
        </section>
    );
};

export default BitacoraDetail;

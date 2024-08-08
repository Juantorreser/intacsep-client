import React, {useState, useEffect} from "react";
import {createRoot} from "react-dom/client";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import {formatDate} from "../../utils/dateUtils"; // Ensure you have a utility to format dates
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table support in jsPDF
import useInactivityTimeout from "../../utils/useInactivityTimeout";
import html2canvas from "html2canvas";
import {Container, Row, Col, Card} from "react-bootstrap";

const BitacoraDetail = React.forwardRef(({bitacora}, ref) => (
    <Container ref={ref} id="pdfBitacora">
        <Container className="my-4">
            <Container className="header">
                <Row className="flex-center">
                    <img src="/intacespTextLogo.jpeg" alt="IntacsepLogo" />
                </Row>
                <Row>
                    <h1>Bitácora de monitoreo {bitacora.id}</h1>
                </Row>
                <Row>
                    <Col>
                        <p>
                            <strong>Inicio Monitoreo:</strong>{" "}
                            {`${formatDate(bitacora.inicioMonitoreo)}, ${new Date(
                                bitacora.inicioMonitoreo
                            ).toLocaleTimeString("es-MX", {timeZone: "America/Mexico_City"})}`}
                        </p>
                    </Col>
                    <Col>
                        <p>
                            <strong>Final Monitoreo:</strong>{" "}
                            {`${formatDate(bitacora.finalMonitoreo)}, ${new Date(
                                bitacora.finalMonitoreo
                            ).toLocaleTimeString("es-MX", {timeZone: "America/Mexico_City"})}`}
                        </p>
                    </Col>
                </Row>
            </Container>
            <Container className="body">
                <Row>
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
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
        </Container>
        <Col>
            {bitacora.eventos.map((evento, index) => (
                <Row md={12} key={index}>
                    <Container className="mb-4 event-card">
                        <Row>
                            <Col md={6} className="title">
                                <h3>{evento.nombre}</h3>
                                <p>
                                    <strong>Descripción:</strong>
                                </p>
                                <p>{evento.descripcion}</p>
                                <p className="mt-4">
                                    <strong>Registrado por: </strong> {evento.registrado_por}
                                </p>
                                <p className="mt-4">
                                    <strong>Frecuencia: </strong> {`${evento.frecuencia} min`}
                                </p>
                            </Col>
                            <Col md={1} className="line">
                                <div className="circle"></div>
                                <div className="line"></div>
                            </Col>
                            <Col md={5} className="fields">
                                <p className="mt-4">
                                    <strong>Ubicación: </strong> {evento.ubicacion}
                                </p>
                                <p className="mt-4">
                                    <strong>Último Posicionamiento: </strong>{" "}
                                    {evento.ultimo_posicionamiento}
                                </p>
                                <p className="mt-4">
                                    <strong>Velocidad: </strong> {evento.velocidad}
                                </p>
                                <p className="mt-4">
                                    <strong>Coordenadas: </strong> {evento.coordenadas}
                                </p>
                                <p className="mt-4">
                                    <strong>Fecha:</strong>{" "}
                                    {new Date(evento.createdAt).toLocaleDateString("es-MX", {
                                        timeZone: "America/Mexico_City",
                                    })}
                                </p>
                                <p className="mt-4">
                                    <strong>Hora:</strong>{" "}
                                    {new Date(evento.createdAt).toLocaleTimeString("es-MX", {
                                        timeZone: "America/Mexico_City",
                                    })}
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </Row>
            ))}
        </Col>
    </Container>
));

const BitacorasPage = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const {user, verifyToken, logout} = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [bitacoras, setBitacoras] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [totalPages, setTotalPages] = useState(1); // Track total pages
    const [totalItems, setTotalItems] = useState(25);
    const [clients, setClients] = useState([]);
    const [monitoreos, setMonitoreos] = useState([]);
    const [users, setUsers] = useState([]);
    const [origenes, setOrigenes] = useState([]);
    const [destinos, setDestinos] = useState([]);
    const [operadores, setOperadores] = useState([]);

    useInactivityTimeout(120000, logout); // 120000 ms = 2 minutes

    const [formData, setFormData] = useState({
        bitacora_id: "",
        folio_servicio: "",
        linea_transporte: "",
        destino: "",
        origen: "",
        monitoreo: "",
        cliente: "",
        enlace: "",
        id_acceso: "",
        contra_acceso: "",
        remolque: {
            eco: "",
            placa: "",
            color: "",
            capacidad: "",
            sello: "",
        },
        tracto: {
            eco: "",
            placa: "",
            marca: "",
            modelo: "",
            color: "",
            tipo: "",
        },
        operador: "",
        telefono: "",
        inicioMonitoreo: "",
        finalMonitoreo: "",
        status: "nueva",
        eventos: [],
    });

    useEffect(() => {
        const initialize = async () => {
            try {
                fetchBitacoras(currentPage, itemsPerPage);
                fetchClients();
                fetchMonitoreos();
                fetchUsers();
                fetchOrigenes();
                fetchDestinos();
                fetchOperadores();
                updateFormDataFromUser();
            } catch (e) {
                console.error("Verification failed:", e);
            }
        };

        initialize();
    }, [user, currentPage, itemsPerPage]);

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

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${baseUrl}/users/`);
            if (response.ok) {
                const data = await response.json();
                const operadores = data.filter((user) => user.role === "Monitorista");
                setUsers(operadores);
            } else {
                console.error("Failed to fetch users:", response.statusText);
            }
        } catch (e) {
            console.error("Error fetching users:", e);
        }
    };

    const fetchBitacoras = async (page = 1, limit = 25) => {
        try {
            const response = await fetch(`${baseUrl}/bitacoras`);
            if (response.ok) {
                const data = await response.json();

                const itemsPerPage = Number(limit) || 25;
                // Sort bitacoras by createdAt in descending order (newest first)
                const sortedData = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setBitacoras(sortedData);
                setTotalItems(data.length); // Update total items

                setTotalPages(Math.ceil(totalItems / itemsPerPage)); // Calculate total pages
            } else {
                console.error("Failed to fetch bitácoras:", response.statusText);
            }
        } catch (e) {
            console.error("Error fetching bitácoras:", e);
        }
    };

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

    const updateFormDataFromUser = () => {
        if (user) {
            setFormData((prevData) => ({
                ...prevData,
                operador: `${user.firstName} ${user.lastName}`,
                telefono: user.phone,
            }));
        }
    };

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const handleChange = (e) => {
        const {id, value} = e.target;
        if (id.startsWith("remolque") || id.startsWith("tracto")) {
            const [field, key] = id.split("_");
            setFormData((prevData) => ({
                ...prevData,
                [field]: {
                    ...prevData[field],
                    [key]: value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [id]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/bitacora`, {
                method: "POST",
                headers: {"content-type": "application/json"},
                credentials: "include",
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                // After successful creation, you might want to refetch bitacoras
                fetchBitacoras();
                handleModalToggle();
            } else {
                console.error("Failed to create bitácora:", response.statusText);
            }
        } catch (e) {
            console.error("Error creating bitácora:", e);
        }
    };

    const getPaginatedBitacoras = (bitacoras, page = 1, limit = 25) => {
        const startIndex = (page - 1) * limit;
        const endIndex = Math.min(startIndex + limit, bitacoras.length);
        return bitacoras.slice(startIndex, endIndex);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchBitacoras(newPage, itemsPerPage);
    };

    const handleItemsPerPageChange = (event) => {
        const newLimit = Number(event.target.value);
        setItemsPerPage(newLimit);
        fetchBitacoras(currentPage, newLimit);
    };

    const generatePDF = async (bitacora) => {
        const tempContainer = document.createElement("div");
        tempContainer.style.position = "absolute";
        tempContainer.style.top = "-9999px";
        document.body.appendChild(tempContainer);

        const root = createRoot(tempContainer);
        root.render(<BitacoraDetail bitacora={bitacora} />);

        setTimeout(() => {
            html2canvas(tempContainer, {scale: 2}).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");

                // Letter size dimensions in points (1 inch = 72 points)
                const letterWidth = 8.5 * 72;
                const letterHeight = 11 * 72;

                // Create PDF with letter size
                const pdf = new jsPDF({
                    orientation: "portrait",
                    unit: "pt",
                    format: [letterWidth, letterHeight],
                    compress: true,
                });

                const imgWidth = letterWidth;
                const imgHeight = canvas.height * (letterWidth / canvas.width);
                const pageHeight = letterHeight;
                const pageWidth = letterWidth;

                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                // Save PDF
                pdf.save(`Bitácora No.${bitacora.bitacora_id}, ${bitacora.cliente}.pdf`);
                document.body.removeChild(tempContainer);
            });
        }, 0);
    };
    return (
        <section id="activeBits">
            <Header />
            <div className="w-100 d-flex">
                {/* Sidebar */}
                <div className="sidebar-wrapper">
                    <Sidebar />
                </div>
                <div className="content-wrapper">
                    <div className="d-flex justify-content-between align-items-center mx-3">
                        <h1 className="text-center flex-grow-1 fs-3 fw-semibold text-black">
                            Bitácoras
                        </h1>
                        <button className="btn btn-primary rounded-5" onClick={handleModalToggle}>
                            <i className="fa fa-plus"></i>
                        </button>
                    </div>

                    {/* Table */}
                    <div className="mx-3 my-4">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Cliente</th>
                                        <th>Tipo Monitoreo</th>
                                        <th>Operador</th>
                                        <th>Fecha Creación</th>
                                        <th>Status</th>
                                        <th className="text-center">
                                            <i className="fa fa-download"></i>
                                        </th>
                                        <th className="text-center">
                                            <i className="fa fa-clipboard-check"></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getPaginatedBitacoras(
                                        bitacoras,
                                        currentPage,
                                        itemsPerPage
                                    ).map((bitacora) => (
                                        <tr key={bitacora._id}>
                                            <td>
                                                <a
                                                    href={`/bitacora/${bitacora._id}`}
                                                    className="text-decoration-none">
                                                    {bitacora.bitacora_id}
                                                </a>
                                            </td>
                                            <td>{bitacora.cliente}</td>
                                            <td>{bitacora.monitoreo}</td>
                                            <td>{bitacora.operador}</td>
                                            <td>
                                                {new Date(bitacora.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>{bitacora.status}</td>
                                            <td className="text-center">
                                                <button
                                                    className={
                                                        bitacora.status !== "finalizada"
                                                            ? "btn btn-secondary"
                                                            : "btn btn-danger"
                                                    }
                                                    onClick={() => generatePDF(bitacora)}
                                                    disabled={bitacora.status !== "finalizada"}>
                                                    <i className="fa fa-file-pdf"></i>
                                                </button>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    className={
                                                        bitacora.edited_bitacora == null
                                                            ? "btn btn-secondary"
                                                            : "btn btn-primary"
                                                    }
                                                    onClick={() =>
                                                        generatePDF(bitacora.edited_bitacora)
                                                    }
                                                    disabled={bitacora.edited_bitacora == null}>
                                                    <i className="fa fa-file-pdf"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-between align-items-center mx-3 my-4">
                        <div>
                            <label htmlFor="itemsPerPage" className="form-label">
                                Items Por Página:
                            </label>
                            <select
                                id="itemsPerPage"
                                className="form-select"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>

                        <div>
                            <button
                                className="btn btn-primary"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}>
                                <i className="fa fa-chevron-left"></i>
                            </button>
                            <span className="mx-2">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                className="btn btn-primary"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}>
                                <i className="fa fa-chevron-right"></i>
                            </button>
                        </div>
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
                                                {monitoreos.map((monitoreo) => (
                                                    <option
                                                        key={monitoreo._id}
                                                        value={monitoreo.tipoMonitoreo}>
                                                        {monitoreo.tipoMonitoreo}
                                                    </option>
                                                ))}
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
                                                {clients.map((client) => (
                                                    <option
                                                        key={client._id}
                                                        value={client.razon_social}>
                                                        {client.razon_social}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group mb-3">
                                            <label htmlFor="folio_servicio">
                                                Folio de Servicio
                                            </label>
                                            <input
                                                id="folio_servicio"
                                                type="text"
                                                value={formData.folio_servicio}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="linea_transporte">
                                                Línea de Transporte
                                            </label>
                                            <input
                                                id="linea_transporte"
                                                type="text"
                                                value={formData.linea_transporte}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="origen" className="form-label">
                                                Origen
                                            </label>
                                            <select
                                                id="origen"
                                                className="form-select"
                                                value={formData.origen}
                                                onChange={handleChange}
                                                required>
                                                <option value="">Seleccionar</option>
                                                {origenes.map((origen) => (
                                                    <option key={origen._id} value={origen.name}>
                                                        {origen.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="destino" className="form-label">
                                                Destino
                                            </label>
                                            <select
                                                id="destino"
                                                className="form-select"
                                                value={formData.destino}
                                                onChange={handleChange}
                                                required>
                                                <option value="">Seleccionar</option>
                                                {destinos.map((destino) => (
                                                    <option key={destino._id} value={destino.name}>
                                                        {destino.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="operador" className="form-label">
                                                Operador
                                            </label>
                                            <select
                                                id="operador"
                                                className="form-select"
                                                value={formData.operador}
                                                onChange={handleChange}
                                                required>
                                                <option value="">Seleccionar</option>
                                                {operadores.map((operador) => (
                                                    <option
                                                        key={operador._id}
                                                        value={operador.name}>
                                                        {operador.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group mb-3">
                                            <label htmlFor="telefono">Telefono</label>
                                            <input
                                                id="telefono"
                                                type="tel"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        <div className="form-group mb-3">
                                            <label htmlFor="enlace">Enlace</label>
                                            <input
                                                id="enlace"
                                                type="text"
                                                value={formData.enlace}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="id_acceso">ID de Acceso</label>
                                            <input
                                                id="id_acceso"
                                                type="text"
                                                value={formData.id_acceso}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="contra_acceso">
                                                Contraseña de Acceso
                                            </label>
                                            <input
                                                id="contra_acceso"
                                                type="text"
                                                value={formData.contra_acceso}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>
                                        <hr />
                                        <p>Tracto: </p>
                                        {/* Tracto */}
                                        <div className="form-group mb-3">
                                            <label htmlFor="tracto_eco">ECO </label>
                                            <input
                                                id="tracto_eco"
                                                type="text"
                                                value={formData.tracto.eco}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="tracto_placa">Placa </label>
                                            <input
                                                id="tracto_placa"
                                                type="text"
                                                value={formData.tracto.placa}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="tracto_marca">Marca </label>
                                            <input
                                                id="tracto_marca"
                                                type="text"
                                                value={formData.tracto.marca}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="tracto_modelo">Modelo </label>
                                            <input
                                                id="tracto_modelo"
                                                type="text"
                                                value={formData.tracto.modelo}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="tracto_color">Color </label>
                                            <input
                                                id="tracto_color"
                                                type="text"
                                                value={formData.tracto.color}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="tracto_tipo">Tipo</label>
                                            <input
                                                id="tracto_tipo"
                                                type="text"
                                                value={formData.tracto.tipo}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>

                                        {/* Remolque */}
                                        <hr />
                                        <p>Remolque: </p>
                                        <div className="form-group mb-3">
                                            <label htmlFor="remolque_eco">ECO</label>
                                            <input
                                                id="remolque_eco"
                                                type="text"
                                                value={formData.remolque.eco}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="remolque_placa">Placa</label>
                                            <input
                                                id="remolque_placa"
                                                type="text"
                                                value={formData.remolque.placa}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="remolque_color">Color</label>
                                            <input
                                                id="remolque_color"
                                                type="text"
                                                value={formData.remolque.color}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="remolque_capacidad">Capacidad</label>
                                            <input
                                                id="remolque_capacidad"
                                                type="text"
                                                value={formData.remolque.capacidad}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="remolque_sello">Sello </label>
                                            <input
                                                id="remolque_sello"
                                                type="text"
                                                value={formData.remolque.sello}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>

                                        <hr />

                                        <div className="d-flex justify-content-end">
                                            <button
                                                type="button"
                                                className="btn btn-danger me-3"
                                                onClick={handleModalToggle}>
                                                Cancelar
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Crear
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}

            <Footer />
        </section>
    );
};

export default BitacorasPage;

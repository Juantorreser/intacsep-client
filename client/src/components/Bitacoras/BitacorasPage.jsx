import React, {useState, useEffect} from "react";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import {formatDate} from "../../utils/dateUtils"; // Ensure you have a utility to format dates
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table support in jsPDF
import {Cookies} from "react-cookie";

const BitacorasPage = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const {user, verifyToken} = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [bitacoras, setBitacoras] = useState([]);
    const [clients, setClients] = useState([]);
    const [monitoreos, setMonitoreos] = useState([]);
    const [users, setUsers] = useState([]);
    const [origenes, setOrigenes] = useState([]);
    const [destinos, setDestinos] = useState([]);
    const [operadores, setOperadores] = useState([]);

    const [formData, setFormData] = useState({
        monitoreo: "",
        cliente: "",
        ecoTracto: "",
        placaTracto: "",
        ecoRemolque: "",
        placaRemolque: "",
        operador: "", // Start empty
        origen: "",
        destino: "",
        enlaceRastreo: "",
        idAcceso: "",
        passwordAcceso: "",
        status: "creada", // Initialize status as 'creada'
        eventos: [], // Initialize empty eventos array
    });

    useEffect(() => {
        const initialize = async () => {
            try {
                fetchBitacoras();
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
    }, [user]);

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

    const fetchBitacoras = async () => {
        try {
            const response = await fetch(`${baseUrl}/bitacoras`);
            if (response.ok) {
                const data = await response.json();
                // Sort bitacoras by createdAt in descending order
                const sortedData = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setBitacoras(sortedData);
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
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
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

    const generatePDF = (bitacora) => {
        const doc = new jsPDF();

        // Add a title
        doc.text(`Bitácora Report`, 105, 10, null, null, "center");

        // Table for Bitácora Details
        doc.autoTable({
            startY: 20,
            head: [["Campo", "Valor"]],
            body: [
                ["Bitácora ID", bitacora.bitacora_id],
                ["Cliente", bitacora.cliente],
                ["Tipo de Monitoreo", bitacora.monitoreo],
                ["Operador", bitacora.operador],
                ["Teléfono", bitacora.telefono],
                ["Fecha Creación", formatDate(bitacora.createdAt)],
                ["Status", bitacora.status],
                ["Origen", bitacora.origen],
                ["Destino", bitacora.destino],
                ["Enlace de Rastreo", bitacora.enlace],
                ["ID de Acceso", bitacora.id_acceso],
                ["Contraseña de Acceso", bitacora.contra_acceso],
                ["ECO Tracto", bitacora.eco_tracto],
                ["Placa Tracto", bitacora.placa_tracto],
                ["ECO Remolque", bitacora.eco_remolque],
                ["Placa Remolque", bitacora.placa_remolque],
                ["Inicio de Monitoreo", formatDate(bitacora.inicioMonitoreo)],
                ["Final de Monitoreo", formatDate(bitacora.finalMonitoreo)],
            ],
        });

        // Add some space before the next table
        let finalY = doc.lastAutoTable.finalY + 10;

        // Table for Events
        doc.autoTable({
            startY: finalY,
            head: [
                [
                    "Nombre del Evento",
                    "Descripción",
                    "Ubicacion",
                    "Distancia",
                    "Duracion",
                    "Fecha de Creación",
                ],
            ],
            body: bitacora.eventos.map((evento) => [
                evento.name,
                evento.description,
                evento.ubicacion,
                evento.distancia,
                evento.duracion,
                formatDate(evento.createdAt),
            ]),
        });

        // Save the PDF
        doc.save(`Bitacora_${bitacora.bitacora_id}.pdf`);
    };

    return (
        <section id="activeBits">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-[15%]">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
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
                                        <th>
                                            <i className="fa fa-download"></i>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bitacoras.map((bitacora) => (
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
                                            <td>{formatDate(bitacora.createdAt)}</td>
                                            <td>{bitacora.status}</td>
                                            <td>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => generatePDF(bitacora)}
                                                    disabled={bitacora.status !== "finalizada"}>
                                                    <i className="fa fa-download"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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

                                        {/* Otros Campos */}
                                        <div className="mb-3">
                                            <label htmlFor="ecoTracto" className="form-label">
                                                ECO Tracto
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="ecoTracto"
                                                value={formData.ecoTracto}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="placaTracto" className="form-label">
                                                Placa Tracto
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="placaTracto"
                                                value={formData.placaTracto}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="ecoRemolque" className="form-label">
                                                ECO Remolque
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="ecoRemolque"
                                                value={formData.ecoRemolque}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="placaRemolque" className="form-label">
                                                Placa Remolque
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="placaRemolque"
                                                value={formData.placaRemolque}
                                                onChange={handleChange}
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

                                        <div className="mb-3">
                                            <label htmlFor="enlaceRastreo" className="form-label">
                                                Enlace de Rastreo
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="enlaceRastreo"
                                                value={formData.enlaceRastreo}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="idAcceso" className="form-label">
                                                ID de Acceso
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="idAcceso"
                                                value={formData.idAcceso}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="passwordAcceso" className="form-label">
                                                Contraseña de Acceso
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="passwordAcceso"
                                                value={formData.passwordAcceso}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
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
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
            <Footer />
        </section>
    );
};

export default BitacorasPage;

import React, {useState, useEffect} from "react";
import ClientCard from "./ClientCard";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        alcaldia: "",
        calle: "",
        ciudad: "",
        clave_pais: "",
        codigo_postal: "",
        colonia: "",
        email: "",
        ID_Cliente: "",
        num_ext: "",
        num_int: "",
        razon_social: "",
        RFC: "",
        telefono: "",
        nombres: "",
        apellidos: "",
        pais: "",
    });

    const baseUrl = import.meta.env.VITE_BASE_URL;

    const fetchClients = async () => {
        try {
            const response = await fetch(`${baseUrl}/clients`, {
                method: "GET",
                credentials: "include",
            });
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

    useEffect(() => {
        fetchClients(); // Fetch clients on component mount
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/clients/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                setClients((prevClients) => prevClients.filter((client) => client._id !== id));
            } else {
                console.error("Failed to delete client:", response.statusText);
            }
        } catch (e) {
            console.error("Error deleting client:", e);
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
            const response = await fetch(`${baseUrl}/clients`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                const newClient = await response.json();
                setClients((prevClients) => [...prevClients, newClient]);
                handleModalToggle();
            } else {
                const errorData = await response.json();
                console.error("Failed to create client:", errorData.message);
            }
        } catch (e) {
            console.error("Error creating client:", e);
        }
    };

    return (
        <section id="clientsPage">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-25">
                    <Sidebar />
                </div>

                <div className="w-100 h-100 col mt-4">
                    <h1 className="text-center fs-3 fw-semibold text-black">Clientes</h1>
                    <div className="text-center mt-4">
                        <button className="btn btn-primary" onClick={handleModalToggle}>
                            Crear Nuevo Cliente
                        </button>
                    </div>

                    <div className="mx-3 my-4">
                        <div className="col">
                            {clients.map((client) => (
                                <div className="col mb-4" key={client._id}>
                                    <ClientCard
                                        client={client}
                                        onDelete={handleDelete}
                                        fetchClients={fetchClients} // Pass fetchClients to ClientCard
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Modal with Backdrop */}
                    {showModal && (
                        <>
                            <div
                                className="modal fade show d-block"
                                id="clientModal"
                                tabIndex="-1"
                                aria-labelledby="clientModalLabel"
                                aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="clientModalLabel">
                                                Crear Nuevo Cliente
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={handleModalToggle}
                                                aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={handleSubmit}>
                                                {/* Nombres */}
                                                <div className="mb-3">
                                                    <label htmlFor="nombres" className="form-label">
                                                        Nombres
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="nombres"
                                                        value={formData.nombres}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Apellidos */}
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="apellidos"
                                                        className="form-label">
                                                        Apellidos
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="apellidos"
                                                        value={formData.apellidos}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div className="mb-3">
                                                    <label htmlFor="email" className="form-label">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Teléfono */}
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="telefono"
                                                        className="form-label">
                                                        Teléfono
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="telefono"
                                                        value={formData.telefono}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Alcaldia */}
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="alcaldia"
                                                        className="form-label">
                                                        Alcaldia
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="alcaldia"
                                                        value={formData.alcaldia}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Calle */}
                                                <div className="mb-3">
                                                    <label htmlFor="calle" className="form-label">
                                                        Calle
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="calle"
                                                        value={formData.calle}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Ciudad */}
                                                <div className="mb-3">
                                                    <label htmlFor="ciudad" className="form-label">
                                                        Ciudad
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ciudad"
                                                        value={formData.ciudad}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Clave País */}
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="clave_pais"
                                                        className="form-label">
                                                        Clave País
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="clave_pais"
                                                        value={formData.clave_pais}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Código Postal */}
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="codigo_postal"
                                                        className="form-label">
                                                        Código Postal
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="codigo_postal"
                                                        value={formData.codigo_postal}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Colonia */}
                                                <div className="mb-3">
                                                    <label htmlFor="colonia" className="form-label">
                                                        Colonia
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="colonia"
                                                        value={formData.colonia}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* ID Cliente */}
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="ID_Cliente"
                                                        className="form-label">
                                                        ID Cliente
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="ID_Cliente"
                                                        value={formData.ID_Cliente}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Número Ext */}
                                                <div className="mb-3">
                                                    <label htmlFor="num_ext" className="form-label">
                                                        Número Ext.
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="num_ext"
                                                        value={formData.num_ext}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Número Int */}
                                                <div className="mb-3">
                                                    <label htmlFor="num_int" className="form-label">
                                                        Número Int.
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="num_int"
                                                        value={formData.num_int}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Razón Social */}
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="razon_social"
                                                        className="form-label">
                                                        Razón Social
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="razon_social"
                                                        value={formData.razon_social}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* RFC */}
                                                <div className="mb-3">
                                                    <label htmlFor="RFC" className="form-label">
                                                        RFC
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="RFC"
                                                        value={formData.RFC}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* País */}
                                                <div className="mb-3">
                                                    <label htmlFor="pais" className="form-label">
                                                        País
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="pais"
                                                        value={formData.pais}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <button type="submit" className="btn btn-primary">
                                                    Crear Cliente
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="modal-backdrop fade show"
                                onClick={handleModalToggle}></div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </section>
    );
};

export default ClientsPage;

import React, {useState, useEffect} from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const TiposMonitoreo = () => {
    const [monitoreos, setMonitoreos] = useState([]);
    const [newMonitoreo, setNewMonitoreo] = useState("");
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
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

        fetchMonitoreos();
    }, [baseUrl]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/monitoreos/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                setMonitoreos(monitoreos.filter((monitoreo) => monitoreo._id !== id));
            } else {
                console.error("Failed to delete monitoreo:", response.statusText);
            }
        } catch (e) {
            console.error("Error deleting monitoreo:", e);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newMonitoreo) return;

        try {
            const response = await fetch(`${baseUrl}/monitoreos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({tipoMonitoreo: newMonitoreo}),
                credentials: "include",
            });

            if (response.ok) {
                const createdMonitoreo = await response.json();
                setMonitoreos([...monitoreos, createdMonitoreo]);
                setNewMonitoreo(""); // Clear the input field
            } else {
                console.error("Failed to create monitoreo:", response.statusText);
            }
        } catch (e) {
            console.error("Error creating monitoreo:", e);
        }
    };

    return (
        <section id="pastBits">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-25">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
                    <h1 className="text-center fs-3 fw-semibold text-black">Tipos de Monitoreo</h1>

                    {/* Create New Monitoreo Form */}
                    <div className="mx-3 my-4">
                        <form onSubmit={handleCreate} className="mb-4">
                            <div className="form-group">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="newMonitoreo"
                                        className="form-control rounded-2"
                                        value={newMonitoreo}
                                        onChange={(e) => setNewMonitoreo(e.target.value)}
                                        placeholder="Ingrese nuevo tipo de monitoreo"
                                    />
                                    <div className="input-group-append ms-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary rounded-circle">
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Responsive Table */}
                    <div className="mx-3 my-4">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Tipo de Monitoreo</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monitoreos.map((monitoreo) => (
                                        <tr key={monitoreo._id}>
                                            <td>{monitoreo.tipoMonitoreo}</td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-danger rounded-circle"
                                                    onClick={() => handleDelete(monitoreo._id)}>
                                                    <i className="fas fa-trash"></i>
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
            <Footer />
        </section>
    );
};

export default TiposMonitoreo;

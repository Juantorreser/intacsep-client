import React, {useState, useEffect} from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const DestinoPage = () => {
    const [destinos, setDestinos] = useState([]);
    const [newDestino, setNewDestino] = useState("");
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
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

        fetchDestinos();
    }, [baseUrl]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/destinos/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                setDestinos(destinos.filter((destino) => destino._id !== id));
            } else {
                console.error("Failed to delete destino:", response.statusText);
            }
        } catch (e) {
            console.error("Error deleting destino:", e);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newDestino) return;

        try {
            const response = await fetch(`${baseUrl}/destinos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: newDestino}),
                credentials: "include",
            });

            if (response.ok) {
                const createdDestino = await response.json();
                setDestinos([...destinos, createdDestino]);
                setNewDestino(""); // Clear the input field
            } else {
                console.error("Failed to create destino:", response.statusText);
            }
        } catch (e) {
            console.error("Error creating destino:", e);
        }
    };

    const handleEdit = async (id, updatedName) => {
        try {
            const response = await fetch(`${baseUrl}/destinos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: updatedName}),
                credentials: "include",
            });

            if (response.ok) {
                setDestinos(
                    destinos.map((destino) =>
                        destino._id === id ? {...destino, name: updatedName} : destino
                    )
                );
            } else {
                console.error("Failed to update destino:", response.statusText);
            }
        } catch (e) {
            console.error("Error updating destino:", e);
        }
    };

    return (
        <section id="destinos">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-[15%]">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
                    <h1 className="text-center fs-3 fw-semibold text-black">Destinos</h1>

                    {/* Create New Destino Form */}
                    <div className="mx-3 my-4">
                        <form onSubmit={handleCreate} className="mb-4">
                            <div className="form-group">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="newDestino"
                                        className="form-control rounded-2"
                                        value={newDestino}
                                        onChange={(e) => setNewDestino(e.target.value)}
                                        placeholder="Ingrese nuevo destino"
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
                                        <th>Nombre del Destino</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {destinos.map((destino) => (
                                        <tr key={destino._id}>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={destino.name}
                                                    onChange={(e) =>
                                                        handleEdit(destino._id, e.target.value)
                                                    }
                                                    className="form-control"
                                                />
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-danger rounded-circle"
                                                    onClick={() => handleDelete(destino._id)}>
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

export default DestinoPage;

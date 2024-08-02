import React, {useState, useEffect} from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const OrigenPage = () => {
    const [origenes, setOrigenes] = useState([]);
    const [newOrigen, setNewOrigen] = useState("");
    const [editingOrigen, setEditingOrigen] = useState(null);
    const [editingName, setEditingName] = useState("");
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
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

        fetchOrigenes();
    }, [baseUrl]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/origenes/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                setOrigenes(origenes.filter((origen) => origen._id !== id));
            } else {
                console.error("Failed to delete origen:", response.statusText);
            }
        } catch (e) {
            console.error("Error deleting origen:", e);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newOrigen) return;

        try {
            const response = await fetch(`${baseUrl}/origenes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: newOrigen}),
                credentials: "include",
            });

            if (response.ok) {
                const createdOrigen = await response.json();
                setOrigenes([...origenes, createdOrigen]);
                setNewOrigen("");
            } else {
                console.error("Failed to create origen:", response.statusText);
            }
        } catch (e) {
            console.error("Error creating origen:", e);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!editingOrigen) return;

        try {
            const response = await fetch(`${baseUrl}/origenes/${editingOrigen._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: editingName}),
                credentials: "include",
            });

            if (response.ok) {
                const updatedOrigen = await response.json();
                setOrigenes(
                    origenes.map((origen) =>
                        origen._id === updatedOrigen._id ? updatedOrigen : origen
                    )
                );
                setEditingOrigen(null);
                setEditingName("");
            } else {
                console.error("Failed to edit origen:", response.statusText);
            }
        } catch (e) {
            console.error("Error editing origen:", e);
        }
    };

    return (
        <section id="origenPage">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-[15%]">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
                    <h1 className="text-center fs-3 fw-semibold text-black">Origenes</h1>

                    {/* Create New Origen Form */}
                    <div className="mx-3 my-4">
                        <form onSubmit={editingOrigen ? handleEdit : handleCreate} className="mb-4">
                            <div className="form-group">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="newOrigen"
                                        className="form-control rounded-2"
                                        value={editingOrigen ? editingName : newOrigen}
                                        onChange={(e) =>
                                            editingOrigen
                                                ? setEditingName(e.target.value)
                                                : setNewOrigen(e.target.value)
                                        }
                                        placeholder="Ingrese nuevo origen"
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
                                        <th>Origen</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {origenes.map((origen) => (
                                        <tr key={origen._id}>
                                            <td>{origen.name}</td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-warning rounded-circle me-2"
                                                    onClick={() => {
                                                        setEditingOrigen(origen);
                                                        setEditingName(origen.name);
                                                    }}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-danger rounded-circle"
                                                    onClick={() => handleDelete(origen._id)}>
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

export default OrigenPage;

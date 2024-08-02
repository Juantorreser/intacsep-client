import React, {useState, useEffect} from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const OperadorPage = () => {
    const [operadores, setOperadores] = useState([]);
    const [newOperador, setNewOperador] = useState("");
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
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

        fetchOperadores();
    }, [baseUrl]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/operadores/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                setOperadores(operadores.filter((operador) => operador._id !== id));
            } else {
                console.error("Failed to delete operador:", response.statusText);
            }
        } catch (e) {
            console.error("Error deleting operador:", e);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newOperador) return;

        try {
            const response = await fetch(`${baseUrl}/operadores`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: newOperador}),
                credentials: "include",
            });

            if (response.ok) {
                const createdOperador = await response.json();
                setOperadores([...operadores, createdOperador]);
                setNewOperador(""); // Clear the input field
            } else {
                console.error("Failed to create operador:", response.statusText);
            }
        } catch (e) {
            console.error("Error creating operador:", e);
        }
    };

    const handleEdit = async (id, updatedName) => {
        try {
            const response = await fetch(`${baseUrl}/operadores/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: updatedName}),
                credentials: "include",
            });

            if (response.ok) {
                setOperadores(
                    operadores.map((operador) =>
                        operador._id === id ? {...operador, name: updatedName} : operador
                    )
                );
            } else {
                console.error("Failed to update operador:", response.statusText);
            }
        } catch (e) {
            console.error("Error updating operador:", e);
        }
    };

    return (
        <section id="operadores">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-[15%]">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
                    <h1 className="text-center fs-3 fw-semibold text-black">Operadores</h1>

                    {/* Create New Operador Form */}
                    <div className="mx-3 my-4">
                        <form onSubmit={handleCreate} className="mb-4">
                            <div className="form-group">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="newOperador"
                                        className="form-control rounded-2"
                                        value={newOperador}
                                        onChange={(e) => setNewOperador(e.target.value)}
                                        placeholder="Ingrese nuevo operador"
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
                                        <th>Nombre del Operador</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {operadores.map((operador) => (
                                        <tr key={operador._id}>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={operador.name}
                                                    onChange={(e) =>
                                                        handleEdit(operador._id, e.target.value)
                                                    }
                                                    className="form-control"
                                                />
                                            </td>
                                            <td className="text-end">
                                                <button
                                                    className="btn btn-danger rounded-circle"
                                                    onClick={() => handleDelete(operador._id)}>
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

export default OperadorPage;

import React, {useState, useEffect} from "react";
import UserCard from "./UserCard"; // Adjust path as needed
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        countryKey: "",
        administrator: false,
        operator: false,
    });

    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${baseUrl}/users`);
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error("Failed to fetch users:", response.statusText);
                }
            } catch (e) {
                console.error("Error fetching users:", e);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/users/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                setUsers(users.filter((user) => user._id !== id));
            } else {
                console.error("Failed to delete user:", response.statusText);
            }
        } catch (e) {
            console.error("Error deleting user:", e);
        }
    };

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const handleChange = (e) => {
        const {id, value, checked, type} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/users`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password, // Ensure this matches the server expectation
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    countryKey: formData.countryKey,
                    administrator: formData.administrator,
                    operator: formData.operator,
                }),
            });
            if (response.ok) {
                const newUser = await response.json();
                setUsers([...users, newUser]);
                handleModalToggle();
            } else {
                const errorData = await response.json();
                console.error("Failed to create user:", errorData.message);
            }
        } catch (e) {
            console.error("Error creating user:", e);
        }
    };

    return (
        <section id="usersPage">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-25">
                    <Sidebar />
                </div>

                <div className="w-100 h-100 col mt-4">
                    <h1 className="text-center fs-3 fw-semibold text-black">Usuarios</h1>
                    <div className="text-center mt-4">
                        <button className="btn btn-primary" onClick={handleModalToggle}>
                            Crear Nuevo Usuario
                        </button>
                    </div>

                    <div className="mx-3 my-4">
                        {users.map((user) => (
                            <UserCard key={user._id} user={user} onDelete={handleDelete} />
                        ))}
                    </div>

                    {/* Modal with Backdrop */}
                    {showModal && (
                        <>
                            <div
                                className="modal fade show d-block"
                                id="userModal"
                                tabIndex="-1"
                                aria-labelledby="userModalLabel"
                                aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="userModalLabel">
                                                Crear Nuevo Usuario
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={handleModalToggle}
                                                aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form onSubmit={handleSubmit}>
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

                                                {/* Password */}
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="password"
                                                        className="form-label">
                                                        Contraseña
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* First Name */}
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="firstName"
                                                        className="form-label">
                                                        Nombre
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="firstName"
                                                        value={formData.firstName}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Last Name */}
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="lastName"
                                                        className="form-label">
                                                        Apellido
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="lastName"
                                                        value={formData.lastName}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                {/* Phone */}
                                                <div className="mb-3">
                                                    <label htmlFor="phone" className="form-label">
                                                        Telefono
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                {/* Country Key */}
                                                <div className="mb-3">
                                                    <label
                                                        htmlFor="countryKey"
                                                        className="form-label">
                                                        Clave Pais
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="countryKey"
                                                        value={formData.countryKey}
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                                {/* Administrator */}
                                                <div className="mb-3 form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="administrator"
                                                        checked={formData.administrator}
                                                        onChange={handleChange}
                                                    />
                                                    <label
                                                        htmlFor="administrator"
                                                        className="form-check-label">
                                                        Administrador
                                                    </label>
                                                </div>

                                                {/* Operator */}
                                                <div className="mb-3 form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="operator"
                                                        checked={formData.operator}
                                                        onChange={handleChange}
                                                    />
                                                    <label
                                                        htmlFor="operator"
                                                        className="form-check-label">
                                                        Operador
                                                    </label>
                                                </div>

                                                <button type="submit" className="btn btn-primary">
                                                    Crear Usuario
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

export default UsersPage;

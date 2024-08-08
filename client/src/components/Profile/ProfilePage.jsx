import React, {useState, useEffect} from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom"; // Ensure you have this imported if using navigation
import Footer from "../Footer";

const ProfilePage = () => {
    const {user, verifyToken, setUser} = useAuth();
    const [pwd, setPwd] = useState();
    const [id, setId] = useState();
    const [initialized, setInitialized] = useState(false);
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [updatedUser, setUpdatedUser] = useState();
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await verifyToken(); // Ensure user is verified
                setUser(data);
                const response = await fetch(`${baseUrl}/user/${data.email}`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setPwd(data.password);
                    setId(data._id);
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        const init = async () => {
            try {
                const data = await verifyToken(); // Ensure user is verified
                setUser(data);
                setInitialized(true); // Set initialization as complete
                setUpdatedUser({
                    password: pwd,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                });
            } catch (e) {
                console.log("Error verifying token or fetching user:", e);
                navigate("/login");
            }
        };
        fetchUser();
        init();
    }, []);

    if (!initialized || !user) {
        // Show a loading state or message until user data is loaded
        return <div>Loading...</div>;
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUpdatedUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
                credentials: "include",
            });

            if (response.ok) {
                setShowToast(true); // Show success toast
                setTimeout(() => setShowToast(false), 3000); // Hide toast after 3 seconds
            } else {
                console.error("Failed to update user:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }

        setShowModal(false); // Close the modal after submission
    };

    return (
        <section id="bitacoraDetail">
            <Header />
            <div className="w-100 d-flex">
                <div className="sidebar-wrapper">
                    <Sidebar />
                </div>
                <div className="content-wrapper px-5 mb-4">
                    <form onSubmit={handleSubmit} className="px-5 mx-5">
                        {/* Form fields */}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={user.email || ""}
                                onChange={handleChange}
                                required
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={pwd}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">
                                Nombre
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                value={updatedUser.firstName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">
                                Apellido
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                value={updatedUser.lastName || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">
                                Telefono
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={updatedUser.phone || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">
                                Rol
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="role"
                                name="role"
                                value={user.role || ""}
                                onChange={handleChange}
                                required
                                disabled
                            />
                        </div>
                        {/* Repeat for other fields... */}
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleModalToggle}>
                            Guardar
                        </button>
                    </form>
                </div>
            </div>
            {/* Backdrop */}
            {showModal && <div className="modal-backdrop fade show"></div>}

            {/* Modal */}
            <div
                className={`modal fade ${showModal ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{display: showModal ? "block" : "none"}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirmar Cambios</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleModalToggle}></button>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro de que deseas guardar los cambios?</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleModalToggle}>
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleSubmit}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast */}
            <div
                className={`toast position-fixed bottom-0 end-0 p-3 bg-success ${
                    showToast ? "show" : ""
                }`}
                style={{zIndex: 11}}>
                <div className="toast-header">
                    <strong className="me-auto">Éxito</strong>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowToast(false)}></button>
                </div>
                <div className="toast-body text-white">Los cambios se han guardado correctamente.</div>
            </div>

            <Footer />
        </section>
    );
};

export default ProfilePage;

import React, {useState, useEffect} from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import Footer from "../Footer";

const ProfilePage = () => {
    const {user, verifyToken, setUser} = useAuth();
    const [pwd, setPwd] = useState("");
    const [id, setId] = useState("");
    const [initialized, setInitialized] = useState(false);
    const [modalData, setModalData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const fetchUser = async () => {
        try {
            const data = await verifyToken();
            setUser(data);
            const response = await fetch(`${baseUrl}/user/${data.email}`, {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setPwd(data.password);
                setId(data._id);
                setModalData({
                    password: data.password,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                });
            } else {
                console.error("Failed to fetch user data");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    useEffect(() => {
        const init = async () => {
            try {
                const data = await verifyToken();
                setUser(data);
                setInitialized(true);
            } catch (e) {
                console.log("Error verifying token or fetching user:", e);
                navigate("/login");
            }
        };

        fetchUser();
        init();
    }, []);

    if (!initialized || !user) {
        return <div>Loading...</div>;
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setModalData((prev) => ({
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
                body: JSON.stringify(modalData),
                credentials: "include",
            });

            if (response.ok) {
                setUser((prevUser) => ({
                    ...prevUser,
                    firstName: modalData.firstName,
                    lastName: modalData.lastName,
                    phone: modalData.phone,
                }));
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            } else {
                console.error("Failed to update user:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }

        handleModalToggle(); // Close the modal after submission
    };

    return (
        <section id="profilePage">
            <Header />
            <div className="w-100 d-flex">
                <div className="sidebar-wrapper">
                    <Sidebar />
                </div>
                <div className="content-wrapper px-5 mb-4">
                    <form className="px-5 mx-5">
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
                                required
                                disabled
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
                                value={modalData.firstName || ""}
                                required
                                disabled
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
                                value={modalData.lastName || ""}
                                required
                                disabled
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
                                value={modalData.phone || ""}
                                required
                                disabled
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
                                required
                                disabled
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleModalToggle}>
                            Editar
                        </button>
                    </form>
                </div>
            </div>

            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div
                        className={`modal fade ${showModal ? "show d-block" : ""}`}
                        tabIndex="-1"
                        style={{display: showModal ? "block" : "none"}}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Perfil</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleModalToggle}></button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="modalPassword" className="form-label">
                                                Contraseña
                                            </label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="modalPassword"
                                                name="password"
                                                value={modalData.password || ""}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="modalFirstName" className="form-label">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="modalFirstName"
                                                name="firstName"
                                                value={modalData.firstName || ""}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="modalLastName" className="form-label">
                                                Apellido
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="modalLastName"
                                                name="lastName"
                                                value={modalData.lastName || ""}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="modalPhone" className="form-label">
                                                Telefono
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="modalPhone"
                                                name="phone"
                                                value={modalData.phone || ""}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={handleModalToggle}>
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

            {showToast && (
                <div
                    className="toast position-fixed bottom-0 end-0 p-3 bg-success"
                    style={{zIndex: 11}}>
                    <div className="toast-header">
                        <strong className="me-auto">Éxito</strong>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowToast(false)}></button>
                    </div>
                    <div className="toast-body text-white">
                        Los cambios se han guardado correctamente.
                    </div>
                </div>
            )}

            <Footer />
        </section>
    );
};

export default ProfilePage;

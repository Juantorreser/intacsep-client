import React, {useState, useEffect} from "react";
import RoleCard from "./RoleCard"; // Adjust path as needed
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const RolePage = () => {
    const [roles, setRoles] = useState([]);
    const [newRole, setNewRole] = useState({
        name: "",
        bitacoras: false,
        edit_bitacora: false,
        tipos_de_monitoreo: false,
        eventos: false,
        clientes: false,
        usuarios: false,
        roles: false,
        origenes: false,
        destinos:false,
        operadores: false
    });
    const [editRole, setEditRole] = useState(null);
    const [editRoleData, setEditRoleData] = useState({
        name: "",
        bitacoras: false,
        edit_bitacora: false,
        tipos_de_monitoreo: false,
        eventos: false,
        clientes: false,
        usuarios: false,
        roles: false,
        origenes: false,
        destinos: false,
        operadores: false,
    });
    const [showModal, setShowModal] = useState(false);
    const baseUrl = import.meta.env.VITE_BASE_URL;

    // Fetch roles from API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch(`${baseUrl}/roles`, {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setRoles(data);
                } else {
                    console.error("Failed to fetch roles:", response.statusText);
                }
            } catch (e) {
                console.error("Error fetching roles:", e);
            }
        };

        fetchRoles();
    }, [baseUrl]);

    // Handle role deletion
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/roles/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                setRoles(roles.filter((role) => role._id !== id));
            } else {
                console.error("Failed to delete role:", response.statusText);
            }
        } catch (e) {
            console.error("Error deleting role:", e);
        }
    };

    // Handle new role creation
    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/roles`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newRole),
                credentials: "include",
            });

            if (response.ok) {
                const createdRole = await response.json();
                setRoles([...roles, createdRole]);
                setNewRole({
                    name: "",
                    bitacoras: false,
                    edit_bitacora: false,
                    tipos_de_monitoreo: false,
                    eventos: false,
                    clientes: false,
                    usuarios: false,
                    roles: false,
                    origenes: false,
                    destinos: false,
                    operadores: false,
                }); // Clear the form
                setShowModal(false); // Close the modal
            } else {
                console.error("Failed to create role:", response.statusText);
            }
        } catch (e) {
            console.error("Error creating role:", e);
        }
    };

    // Handle role edit button click
    const handleEditClick = (role) => {
        setEditRole(role);
        setEditRoleData({...role});
    };

    // Handle role update
    const handleEditSave = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/roles/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editRoleData),
                credentials: "include",
            });

            if (response.ok) {
                const updatedRole = await response.json();
                setRoles(roles.map((role) => (role._id === id ? updatedRole : role)));
                setEditRole(null);
                setEditRoleData({
                    name: "",
                    bitacoras: false,
                    edit_bitacora: false,
                    tipos_de_monitoreo: false,
                    eventos: false,
                    clientes: false,
                    usuarios: false,
                    roles: false,
                    origenes: false,
                    destinos: false,
                    operadores: false,
                });
            } else {
                console.error("Failed to update role:", response.statusText);
            }
        } catch (e) {
            console.error("Error updating role:", e);
        }
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setEditRole(null);
        setEditRoleData({
            name: "",
            bitacoras: false,
            edit_bitacora: false,
            tipos_de_monitoreo: false,
            eventos: false,
            clientes: false,
            usuarios: false,
            roles: false,
            origenes: false,
            destinos: false,
            operadores: false,
        });
    };

    // Handle form input changes
    const handleInputChange = (e, setter) => {
        const {name, type, checked, value} = e.target;
        setter((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <section id="rolePage">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-[15%]">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
                    <div className="d-flex align-items-center mb-4">
                        <h1 className="fs-3 fw-semibold text-black m-0 flex-grow-1 text-center">
                            Roles
                        </h1>
                        <button
                            className="btn btn-primary rounded-circle me-3"
                            onClick={() => setShowModal(true)}>
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>

                    {/* Role Cards */}
                    <div className="mx-3 my-4">
                        {roles.map((role) => (
                            <RoleCard
                                key={role._id}
                                role={role}
                                onEditClick={handleEditClick}
                                onDelete={handleDelete}
                                editRole={editRole}
                                editRoleData={editRoleData}
                                onEditSave={handleEditSave}
                                onCancelEdit={handleCancelEdit}
                                setEditRoleData={setEditRoleData}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal for Creating New Role */}
            <div
                className={`modal fade ${showModal ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{display: showModal ? "block" : "none"}}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Create New Role</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}></button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="roleName" className="form-label">
                                        Role Name
                                    </label>
                                    <input
                                        type="text"
                                        id="roleName"
                                        name="name"
                                        className="form-control"
                                        value={newRole.name}
                                        onChange={(e) => handleInputChange(e, setNewRole)}
                                        placeholder="Enter role name"
                                        required
                                    />
                                </div>
                                {/* Permissions */}
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id="bitacoras"
                                        name="bitacoras"
                                        className="form-check-input"
                                        checked={newRole.bitacoras}
                                        onChange={(e) => handleInputChange(e, setNewRole)}
                                    />
                                    <label htmlFor="bitacoras" className="form-check-label">
                                        Bitacoras
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id="edit_bitacora"
                                        name="edit_bitacora"
                                        className="form-check-input"
                                        checked={newRole.edit_bitacora}
                                        onChange={(e) => handleInputChange(e, setNewRole)}
                                    />
                                    <label htmlFor="edit_bitacora" className="form-check-label">
                                        Editar Bitacoras
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id="tipos_de_monitoreo"
                                        name="tipos_de_monitoreo"
                                        className="form-check-input"
                                        checked={newRole.tipos_de_monitoreo}
                                        onChange={(e) => handleInputChange(e, setNewRole)}
                                    />
                                    <label
                                        htmlFor="tipos_de_monitoreo"
                                        className="form-check-label">
                                        Tipos de Monitoreo
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id="eventos"
                                        name="eventos"
                                        className="form-check-input"
                                        checked={newRole.eventos}
                                        onChange={(e) => handleInputChange(e, setNewRole)}
                                    />
                                    <label htmlFor="eventos" className="form-check-label">
                                        Eventos
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id="clientes"
                                        name="clientes"
                                        className="form-check-input"
                                        checked={newRole.clientes}
                                        onChange={(e) => handleInputChange(e, setNewRole)}
                                    />
                                    <label htmlFor="clientes" className="form-check-label">
                                        Clientes
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id="usuarios"
                                        name="usuarios"
                                        className="form-check-input"
                                        checked={newRole.usuarios}
                                        onChange={(e) => handleInputChange(e, setNewRole)}
                                    />
                                    <label htmlFor="usuarios" className="form-check-label">
                                        Usuarios
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id="roles"
                                        name="roles"
                                        className="form-check-input"
                                        checked={newRole.roles}
                                        onChange={(e) => handleInputChange(e, setNewRole)}
                                    />
                                    <label htmlFor="roles" className="form-check-label">
                                        Roles
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id="origenes"
                                        name="origenes"
                                        className="form-check-input"
                                        checked={newRole.origenes}
                                        onChange={(e) => handleInputChange(e, setNewRole)}
                                    />
                                    <label htmlFor="origenes" className="form-check-label">
                                        Origenes
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id="destinos"
                                        name="destinos"
                                        className="form-check-input"
                                        checked={newRole.destinos}
                                        onChange={(e) => handleInputChange(e, setNewRole)}
                                    />
                                    <label htmlFor="destinos" className="form-check-label">
                                        Destinos
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id="operadores"
                                        name="operadores"
                                        className="form-check-input"
                                        checked={newRole.operadores}
                                        onChange={(e) => handleInputChange(e, setNewRole)}
                                    />
                                    <label htmlFor="operadores" className="form-check-label">
                                        Operadores
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </section>
    );
};

export default RolePage;

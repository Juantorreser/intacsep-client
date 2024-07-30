import React, {useState, useEffect} from "react";

const ClientCard = ({client, onDelete, fetchClients}) => {
    const [formData, setFormData] = useState({...client});
    const [isEditable, setIsEditable] = useState(false);

    // Update formData when client prop changes
    useEffect(() => {
        setFormData({...client});
    }, [client]);

    const handleChange = (e) => {
        const {id, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleEdit = () => {
        setIsEditable(true);
    };

    const handleCancel = async () => {
        setIsEditable(false);
        setFormData({...client}); // Reset formData to original client data
    };

    const handleConfirm = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/clients/${client._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setIsEditable(false);
                await fetchClients(); // Refresh the client list after update
            } else {
                console.error("Failed to update client:", response.statusText);
            }
        } catch (e) {
            console.error("Error updating client:", e);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/clients/${client._id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                await onDelete(client._id); // Notify parent component about the deletion
                await fetchClients(); // Refresh the client list after deletion
            } else {
                console.error("Failed to delete client:", response.statusText);
            }
        } catch (e) {
            console.error("Error deleting client:", e);
        }
    };

    return (
        <div className="card mb-3">
            <div className="card-body d-flex flex-row flex-wrap align-items-center">
                <div className="me-3">
                    <h5 className="card-title mb-0">
                        {formData.nombres} {formData.apellidos}
                    </h5>
                    <p className="card-text mb-0">
                        <strong>Razón Social:</strong> {formData.razon_social}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Email:</strong> {formData.email}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Teléfono:</strong> {formData.telefono}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Alcaldía:</strong> {formData.alcaldia}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Calle:</strong> {formData.calle}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Ciudad:</strong> {formData.ciudad}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Clave País:</strong> {formData.clave_pais}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Código Postal:</strong> {formData.codigo_postal}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Colonia:</strong> {formData.colonia}
                    </p>
                    <p className="card-text mb-0">
                        <strong>ID Cliente:</strong> {formData.ID_Cliente}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Número Ext:</strong> {formData.num_ext}
                    </p>
                    <p className="card-text mb-0">
                        <strong>Número Int:</strong> {formData.num_int}
                    </p>
                    <p className="card-text mb-0">
                        <strong>RFC:</strong> {formData.RFC}
                    </p>
                    <p className="card-text mb-0">
                        <strong>País:</strong> {formData.pais}
                    </p>
                </div>
                <div className="ms-auto">
                    {isEditable ? (
                        <>
                            <button className="btn btn-primary me-2" onClick={handleConfirm}>
                                Confirmar
                            </button>
                            <button className="btn btn-secondary" onClick={handleCancel}>
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-warning me-2" onClick={handleEdit}>
                                Editar
                            </button>
                            <button className="btn btn-danger" onClick={handleDelete}>
                                Eliminar
                            </button>
                        </>
                    )}
                </div>
            </div>
            {isEditable && (
                <div className="card-body">
                    <form>
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
                            <label htmlFor="apellidos" className="form-label">
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
                            <label htmlFor="telefono" className="form-label">
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
                        {/* Alcaldía */}
                        <div className="mb-3">
                            <label htmlFor="alcaldia" className="form-label">
                                Alcaldía
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
                            <label htmlFor="clave_pais" className="form-label">
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
                            <label htmlFor="codigo_postal" className="form-label">
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
                            <label htmlFor="ID_Cliente" className="form-label">
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
                            <label htmlFor="razon_social" className="form-label">
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
                    </form>
                </div>
            )}
        </div>
    );
};

export default ClientCard;

// UserRoleCard.jsx
import React, { useState } from "react";

const UserRoleCard = ({ user, onUpdate }) => {
    const [isAdmin, setIsAdmin] = useState(user.administrator);
    const [isOperator, setIsOperator] = useState(user.operator);
    const [isEditable, setIsEditable] = useState(false);

    const handleAdminChange = (e) => {
        setIsAdmin(e.target.checked);
    };

    const handleOperatorChange = (e) => {
        setIsOperator(e.target.checked);
    };

    const handleEdit = () => {
        setIsEditable(true);
    };

    const handleCancel = () => {
        setIsAdmin(user.administrator);
        setIsOperator(user.operator);
        setIsEditable(false);
    };

    const handleConfirm = async () => {
        const updatedUser = {
            ...user,
            administrator: isAdmin,
            operator: isOperator,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/users/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(updatedUser),
            });
            if (response.ok) {
                const updatedData = await response.json();
                onUpdate(updatedData); // Notify parent component about the update
                setIsEditable(false);
            } else {
                console.error("Failed to update user:", response.statusText);
            }
        } catch (e) {
            console.error("Error updating user:", e);
        }
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">
                    {user.firstName} {user.lastName}
                </h5>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`admin-${user._id}`}
                        checked={isAdmin}
                        onChange={handleAdminChange}
                        disabled={!isEditable}
                    />
                    <label htmlFor={`admin-${user._id}`} className="form-check-label">
                        Administrador
                    </label>
                </div>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id={`operator-${user._id}`}
                        checked={isOperator}
                        onChange={handleOperatorChange}
                        disabled={!isEditable}
                    />
                    <label htmlFor={`operator-${user._id}`} className="form-check-label">
                        Operador
                    </label>
                </div>
                {!isEditable ? (
                    <button className="btn btn-primary mt-3" onClick={handleEdit}>
                        Editar
                    </button>
                ) : (
                    <>
                        <button className="btn btn-success mt-3" onClick={handleConfirm}>
                            Confirmar
                        </button>
                        <button className="btn btn-secondary mt-3 ms-2" onClick={handleCancel}>
                            Cancelar
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserRoleCard;

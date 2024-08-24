import React, {useState} from "react";

const TransporteDetails = ({bitacora, transportes, setTransportes}) => {
    const [selectedTransporte, setSelectedTransporte] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedBitacora, setEditedBitacora] = useState(bitacora);
    const [isEdited, setIsEdited] = useState(false);

    const handleEditClick = (transporte) => {
        setSelectedTransporte(transporte);
        setEditModalVisible(true);
    };

    const handleEditChange = (e) => {
        const {name, value} = e.target;
        setSelectedTransporte((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        console.log(editedBitacora);

        try {
            // Save the edited transportes to edited_bitacora
            const updatedTransportes = editedBitacora.transportes.map((transporte) =>
                transporte.id === selectedTransporte.id ? selectedTransporte : transporte
            );

            setEditedBitacora((prev) => ({
                ...prev,
                transportes: updatedTransportes,
            }));

            const response = await fetch(`${baseUrl}/bitacora/${bitacora._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editedBitacora),
                credentials: "include",
            });

            if (response.ok) {
                const updatedBitacora = await response.json();
                setTransportes(updatedBitacora.transportes);
                setIsEdited(!isEdited);
                setEditModalVisible(false);
            } else {
                console.error("Failed to edit bitácora:", response.statusText);
            }
        } catch (e) {
            console.error("Error editing bitácora:", e);
        }
    };

    return (
        <div className="d-flex mt-4">
            {/* Column 1 - List of Transporte IDs */}
            <div className="col-md-3">
                <ul className="list-group">
                    {transportes.map((transporte) => (
                        <li
                            key={transporte.id}
                            className="list-group-item"
                            onClick={() => setSelectedTransporte(transporte)}>
                            Transporte ID: {transporte.id}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Column 2 - Selected Transporte Details */}
            <div className="col-md-6">
                {selectedTransporte && (
                    <>
                        
                        {/* Edit Button */}
                        <button
                            className="btn btn-primary mt-2"
                            onClick={() => handleEditClick(selectedTransporte)}>
                            Edit
                        </button>
                    </>
                )}
            </div>

            {/* Edit Modal */}
            {editModalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Edit Transporte</h4>
                        <form onSubmit={handleEditSubmit}>
                            <input
                                type="text"
                                name="eco"
                                value={selectedTransporte.tracto.eco}
                                onChange={handleEditChange}
                            />
                            {/* Add other fields similarly */}
                            <button type="submit" className="btn btn-success">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setEditModalVisible(false)}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransporteDetails;

import React, {useState, useEffect} from "react";
import {Modal, Button, Form} from "react-bootstrap";

const InactivityModal = ({show, handleClose, timeout, modifyTimeout}) => {
    // Convert the initial timeout from ms to seconds
    const [newTimeout, setNewTimeout] = useState(timeout / 1000);

    useEffect(() => {
        // Update the state when the timeout or show prop changes
        setNewTimeout(timeout / 1000);
    }, [timeout, show]);

    const handleSave = () => {
        // Convert the timeout back to milliseconds before saving
        modifyTimeout(newTimeout * 1000);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Configurar tiempo de inactividad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formTimeout">
                        <Form.Label>Tiempo de inactividad (segundos)</Form.Label>
                        <Form.Control
                            type="number"
                            value={newTimeout}
                            onChange={(e) => setNewTimeout(Number(e.target.value))}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="success" onClick={handleSave}>
                    Guardar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default InactivityModal;

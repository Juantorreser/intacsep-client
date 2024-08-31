import React, {useState, useEffect} from "react";
import {Modal, Button, Form} from "react-bootstrap";

const InactivityModal = ({show, handleClose}) => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const timeout = 60;
    // Convert the initial timeout from ms to seconds
    const [newTimeout, setNewTimeout] = useState();

    useEffect(() => {
        // Update the state when the timeout or show prop changes
        try {
            const response = fetch(`${baseUrl}/inactividad`);
            const data = response.value;
            console.log(data);
            
        } catch (e) {
            console.log(e.message);
        }
    }, [timeout, show]);

    const handleSave = () => {
        // Convert the timeout back to milliseconds before saving

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

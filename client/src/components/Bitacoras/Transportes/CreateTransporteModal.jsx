import React from "react";
import {useState} from "react";
import { Modal, Form } from "react-bootstrap";

const CreateTransporteModal = ({show, handleClose, addTransporte, transportes, bitacora}) => {
  const [transporteData, setTransporteData] = useState({
    tracto: {
      eco: "",
      placa: "",
      marca: "",
      modelo: "",
      color: "",
      tipo: "",
    },
    remolque: {
      eco: "",
      placa: "",
      color: "",
      capacidad: "",
      sello: "",
    },
  });

  // Handle form input changes
  const handleChange = (e) => {
    const {name, value} = e.target;
    const [section, field] = name.split(".");
    if (section && field) {
      setTransporteData((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: value,
        },
      }));
    } else {
      setTransporteData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmitTransporte = (e) => {
    e.preventDefault();
    const newId = transportes.length + 1; // Calculate ID dynamically based on current length
    const newTransporteData = {id: newId, ...transporteData}; // Set the calculated ID here

    addTransporte(newTransporteData, bitacora._id);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Nuevo Transporte</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmitTransporte}>
          <Form.Group className="mb-3">
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              name="id"
              value={(transportes.length + 1).toString().padStart(2, "0")}
              onChange={handleChange}
              required
              disabled
            />
          </Form.Group>

          {/* Tracto Fields */}
          <h5>Tracto</h5>
          <Form.Group className="mb-3">
            <Form.Label>Eco</Form.Label>
            <Form.Control
              type="text"
              name="tracto.eco"
              value={transporteData.tracto.eco}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Placa</Form.Label>
            <Form.Control
              type="text"
              name="tracto.placa"
              value={transporteData.tracto.placa}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Marca</Form.Label>
            <Form.Control
              type="text"
              name="tracto.marca"
              value={transporteData.tracto.marca}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Modelo</Form.Label>
            <Form.Control
              type="text"
              name="tracto.modelo"
              value={transporteData.tracto.modelo}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="text"
              name="tracto.color"
              value={transporteData.tracto.color}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              type="text"
              name="tracto.tipo"
              value={transporteData.tracto.tipo}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Remolque Fields */}
          <h5>Remolque</h5>
          <Form.Group className="mb-3">
            <Form.Label>Eco</Form.Label>
            <Form.Control
              type="text"
              name="remolque.eco"
              value={transporteData.remolque.eco}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Placa</Form.Label>
            <Form.Control
              type="text"
              name="remolque.placa"
              value={transporteData.remolque.placa}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Color</Form.Label>
            <Form.Control
              type="text"
              name="remolque.color"
              value={transporteData.remolque.color}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="text"
              name="remolque.capacidad"
              value={transporteData.remolque.capacidad}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Sello</Form.Label>
            <Form.Control
              type="text"
              name="remolque.sello"
              value={transporteData.remolque.sello}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <div className="d-flex w-100 justify-content-end">
            <button type="cancel" className="btn btn-danger px-3 me-3" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-success px-4">
              Crear
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateTransporteModal;

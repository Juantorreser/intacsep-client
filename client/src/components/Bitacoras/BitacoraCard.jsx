import React from "react";
import {useNavigate} from "react-router-dom";

const BitacoraCard = ({
    id,
    bitacora_id,
    destino,
    origen,
    monitoreo,
    cliente,
    enlace,
    id_acceso,
    contra_acceso,
    placa_remolque,
    placa_tracto,
    eco_remolque,
    eco_tracto,
    operador,
    telefono,
    inicioMonitoreo,
    finalMonitoreo,
}) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/bitacora/${id}`);
        console.log(id);
    };

    return (
        <div className="card mb-3">
            <div className="card-body d-flex align-items-center">
                <div className="row w-100">
                    <div className="col-md-9">
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <h6 className="card-subtitle mb-1">
                                    <strong>ID:</strong> {bitacora_id}
                                </h6>
                            </div>
                            <div className="col-md-6">
                                <h6 className="card-subtitle mb-1">
                                    <strong>Monitoreo:</strong> {monitoreo}
                                </h6>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col-md-6">
                                <h6 className="card-subtitle mb-1">
                                    <strong>Destino:</strong> {destino}
                                </h6>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Origen:</strong> {origen}
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Cliente:</strong> {cliente}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Enlace:</strong> {enlace}
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>ID Acceso:</strong> {id_acceso}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Contra Acceso:</strong> {contra_acceso}
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Placa Remolque:</strong> {placa_remolque}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Placa Tracto:</strong> {placa_tracto}
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Eco Remolque:</strong> {eco_remolque}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Eco Tracto:</strong> {eco_tracto}
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Operador:</strong> {operador}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Teléfono:</strong> {telefono}
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Inicio Monitoreo:</strong>{" "}
                                    {inicioMonitoreo
                                        ? new Date(inicioMonitoreo).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Final Monitoreo:</strong>{" "}
                                    {finalMonitoreo
                                        ? new Date(finalMonitoreo).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 d-flex justify-content-center align-items-center">
                        <button
                            className="btn btn-light"
                            style={{
                                border: "none",
                                backgroundColor: "transparent",
                            }}
                            onClick={handleViewDetails}>
                            <i className="fa fa-chevron-right" style={{fontSize: "1.5em"}}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BitacoraCard;

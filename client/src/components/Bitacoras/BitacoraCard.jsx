import React from "react";
import PropTypes from "prop-types";

const BitacoraCard = ({
    id,
    destino,
    origen,
    monitoreo,
    cliente,
    id_enlace,
    id_remolque,
    id_tracto,
    operador,
    telefono,
    inicioMonitoreo,
    finalMonitoreo,
}) => {
    return (
        <div className="card mb-3">
            <div className="card-body d-flex align-items-center">
                {/* Content on the left side */}
                <div className="row w-100">
                    <div className="col-md-9">
                        <h5 className="card-title">Bitácora Detalles</h5>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <h6 className="card-subtitle mb-1">
                                    <strong>ID:</strong> {id}
                                </h6>
                            </div>
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
                                    <strong>Monitoreo:</strong> {monitoreo}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Cliente:</strong> {cliente}
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>ID Enlace:</strong> {id_enlace}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>ID Remolque:</strong> {id_remolque}
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>ID Tracto:</strong> {id_tracto}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Operador:</strong> {operador}
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Teléfono:</strong> {telefono}
                                </p>
                            </div>
                            <div className="col-md-6">
                                <p className="card-text mb-1">
                                    <strong>Inicio Monitoreo:</strong>{" "}
                                    {inicioMonitoreo
                                        ? new Date(inicioMonitoreo).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                        <div className="row mb-2">
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
                    {/* Chevron button on the right side */}
                    <div className="col-md-3 d-flex justify-content-center align-items-center">
                        <button
                            className="btn btn-light"
                            style={{
                                border: "none",
                                backgroundColor: "transparent",
                            }}>
                            <i className="fa fa-chevron-right" style={{fontSize: "1.5em"}}></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-footer text-muted">
                {/* Additional footer content can go here */}
            </div>
        </div>
    );
};


export default BitacoraCard;

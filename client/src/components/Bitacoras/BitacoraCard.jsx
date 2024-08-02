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
    onStartMonitoring,
    onEndMonitoring,
}) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/bitacora/${id}`);
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="row">
                    {/* Column 1 */}
                    <div className="col-md-4">
                        <h6 className="card-subtitle mb-1">
                            <strong>ID Cliente:</strong> {cliente}
                        </h6>
                        <h6 className="card-subtitle mb-1">
                            <strong>Cliente:</strong> {cliente}
                        </h6>
                        <h6 className="card-subtitle mb-1">
                            <strong>Teléfono:</strong> {telefono}
                        </h6>
                        <p className="card-text mb-1">
                            <strong>Inicio de Monitoreo:</strong>{" "}
                            {inicioMonitoreo
                                ? new Date(inicioMonitoreo).toLocaleDateString()
                                : "N/A"}
                        </p>
                        <p className="card-text mb-1">
                            <strong>Fin de Monitoreo:</strong>{" "}
                            {finalMonitoreo ? new Date(finalMonitoreo).toLocaleDateString() : "N/A"}
                        </p>
                        <button className="btn btn-primary" onClick={() => onStartMonitoring(id)}>
                            Iniciar Monitoreo
                        </button>
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={() => onEndMonitoring(id)}>
                            Finalizar Monitoreo
                        </button>
                    </div>

                    {/* Column 2 */}
                    <div className="col-md-4">
                        <h6 className="card-subtitle mb-1">
                            <strong>Monitoreo:</strong> {monitoreo}
                        </h6>
                        <h6 className="card-subtitle mb-1">
                            <strong>Operador:</strong> {operador}
                        </h6>
                        <h6 className="card-subtitle mb-1">
                            <strong>ECO Tracto:</strong> {eco_tracto}
                        </h6>
                        <h6 className="card-subtitle mb-1">
                            <strong>Placa Tracto:</strong> {placa_tracto}
                        </h6>
                        <h6 className="card-subtitle mb-1">
                            <strong>ECO Remolque:</strong> {eco_remolque}
                        </h6>
                        <h6 className="card-subtitle mb-1">
                            <strong>Placa Remolque:</strong> {placa_remolque}
                        </h6>
                    </div>

                    {/* Column 3 */}
                    <div className="col-md-4">
                        <h6 className="card-subtitle mb-1">
                            <strong>Origen:</strong> {origen}
                        </h6>
                        <h6 className="card-subtitle mb-1">
                            <strong>Destino:</strong> {destino}
                        </h6>
                        <h6 className="card-subtitle mb-1">
                            <strong>Enlace:</strong> {enlace}
                        </h6>
                        <h6 className="card-subtitle mb-1">
                            <strong>ID Acceso:</strong> {id_acceso}
                        </h6>
                        <h6 className="card-subtitle mb-1">
                            <strong>Contraseña Acceso:</strong> {contra_acceso}
                        </h6>
                    </div>
                </div>

                {/* View Details Button */}
                <div className="d-flex justify-content-center mt-3">
                    <button
                        className="btn btn-light"
                        style={{border: "none", backgroundColor: "transparent"}}
                        onClick={handleViewDetails}>
                        <i className="fa fa-chevron-right" style={{fontSize: "1.5em"}}></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BitacoraCard;

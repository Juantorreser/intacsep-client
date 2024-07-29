import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const BitacoraDetail = () => {
    const {id} = useParams();
    const [bitacora, setBitacora] = useState(null);
    const [finishButtonDisabled, setFinishButtonDisabled] = useState(false);
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchBitacora = async () => {
            try {
                const response = await fetch(`${baseUrl}/bitacora/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setBitacora(data);
                    // Update button state based on bitacora status
                    if (data.finalMonitoreo) {
                        setFinishButtonDisabled(true);
                    }
                } else {
                    console.error("Failed to fetch bitácora:", response.statusText);
                }
            } catch (e) {
                console.error("Error fetching bitácora:", e);
            }
        };

        fetchBitacora();
    }, [id, baseUrl]);

    const handleStart = async () => {
        try {
            const response = await fetch(`${baseUrl}/bitacora/${id}/start`, {
                method: "PATCH",
                credentials: "include",
            });
            if (response.ok) {
                const updatedBitacora = await response.json();
                setBitacora(updatedBitacora);
            } else {
                console.error("Failed to start bitácora:", response.statusText);
            }
        } catch (e) {
            console.error("Error starting bitácora:", e);
        }
    };

    const handleFinish = async () => {
        try {
            const response = await fetch(`${baseUrl}/bitacora/${id}/finish`, {
                method: "PATCH",
                credentials: "include",
            });
            if (response.ok) {
                const updatedBitacora = await response.json();
                setBitacora(updatedBitacora);
                setFinishButtonDisabled(true); // Disable the finish button after successful finish
            } else {
                console.error("Failed to finish bitácora:", response.statusText);
            }
        } catch (e) {
            console.error("Error finishing bitácora:", e);
        }
    };

    if (!bitacora) {
        return <div>Loading...</div>;
    }

    const EventCard = ({title, dateTime, address, lastUpdate, speed, timestamp}) => (
        <div className="col-md-6 col-lg-4">
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">
                        <strong>Fecha y Hora:</strong> {dateTime}
                    </p>
                    <p className="card-text">
                        <strong>Dirección:</strong> {address}
                    </p>
                    <p className="card-text">
                        <strong>Última actualización:</strong> {lastUpdate}
                    </p>
                    <p className="card-text">
                        <strong>Velocidad:</strong> {speed}
                    </p>
                    <p className="card-text">
                        <strong>Timestamp:</strong> {timestamp}
                    </p>
                </div>
            </div>
        </div>
    );

    const events = [
        {
            title: "Validación de Datos",
            dateTime: "03/06/2024 09:30 HRS",
            address:
                "Calle 25 54, Progreso Nacional, Gustavo A Madero, Ciudad De México 07600, Mexico",
            lastUpdate: "hace 3 h 3 min",
            speed: "0 km/h",
            timestamp: "27.06.2024 19:04:09",
        },
        {
            title: "Validación de Datos",
            dateTime: "10/06/2024 10:45 HRS",
            address: "Avenida Insurgentes 3000, Ciudad De México, 03900, Mexico",
            lastUpdate: "hace 1 h 15 min",
            speed: "10 km/h",
            timestamp: "27.06.2024 20:12:30",
        },
        {
            title: "Validación de Datos",
            dateTime: "15/06/2024 14:00 HRS",
            address: "Paseo de la Reforma 400, Ciudad De México, 06600, Mexico",
            lastUpdate: "hace 2 h 45 min",
            speed: "5 km/h",
            timestamp: "27.06.2024 21:45:00",
        },
        {
            title: "Validación de Datos",
            dateTime: "20/06/2024 11:30 HRS",
            address: "Eje Central Lázaro Cárdenas 200, Ciudad De México, 07000, Mexico",
            lastUpdate: "hace 30 min",
            speed: "15 km/h",
            timestamp: "27.06.2024 22:00:00",
        },
    ];

    return (
        <section id="bitacoraDetail">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-25">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
                    <h1 className="text-center fs-3 fw-semibold text-black">
                        Detalle de la Bitácora
                    </h1>
                    <div className="card mb-3">
                        <div className="card-body">
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <h6 className="card-subtitle mb-1">
                                        <strong>ID:</strong> {bitacora.bitacora_id}
                                    </h6>
                                </div>
                                <div className="col-md-6">
                                    <h6 className="card-subtitle mb-1">
                                        <strong>Monitoreo:</strong> {bitacora.monitoreo}
                                    </h6>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Destino:</strong> {bitacora.destino}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Origen:</strong> {bitacora.origen}
                                    </p>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Cliente:</strong> {bitacora.cliente}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Enlace:</strong> {bitacora.enlace}
                                    </p>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>ID Acceso:</strong> {bitacora.id_acceso}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Contra Acceso:</strong> {bitacora.contra_acceso}
                                    </p>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Placa Remolque:</strong> {bitacora.placa_remolque}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Placa Tracto:</strong> {bitacora.placa_tracto}
                                    </p>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Eco Remolque:</strong> {bitacora.eco_remolque}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Eco Tracto:</strong> {bitacora.eco_tracto}
                                    </p>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Operador:</strong> {bitacora.operador}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Teléfono:</strong> {bitacora.telefono}
                                    </p>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Inicio Monitoreo:</strong>{" "}
                                        {bitacora.inicioMonitoreo
                                            ? new Date(
                                                  bitacora.inicioMonitoreo
                                              ).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <p className="card-text">
                                        <strong>Final Monitoreo:</strong>{" "}
                                        {bitacora.finalMonitoreo
                                            ? new Date(bitacora.finalMonitoreo).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                            <div className="text-center mt-3">
                                {!bitacora.iniciada ? (
                                    <button className="btn btn-success" onClick={handleStart}>
                                        Iniciar
                                    </button>
                                ) : (
                                    <button
                                        className={`btn ${
                                            !bitacora.iniciada ? "btn-success" : "btn-danger"
                                        } ${finishButtonDisabled ? "btn-disabled" : ""}`}
                                        onClick={handleFinish}
                                        disabled={finishButtonDisabled}>
                                        Finalizar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <h1 className="text-center fs-3 fw-semibold text-black">Eventos</h1>
                    <div className="container mt-4">
                        <div className="row">
                            {events.map((event, index) => (
                                <EventCard key={index} {...event} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    );
};

export default BitacoraDetail;

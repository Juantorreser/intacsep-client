import React, {useState, useEffect} from "react";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import BitacoraCard from "./BitacoraCard"; // Ensure this path is correct

const PastBits = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const {user, verifyToken} = useAuth();
    const navigate = useNavigate();
    const [bitacoras, setBitacoras] = useState([]);

    useEffect(() => {
        // Fetch past bitacoras when the component mounts
        const fetchBitacoras = async () => {
            try {
                const response = await fetch(`${baseUrl}/bitacora_past`);
                if (response.ok) {
                    const data = await response.json();
                    setBitacoras(data);
                    console.log("Fetched past bitácoras:", data);
                } else {
                    console.error("Failed to fetch past bitácoras:", response.statusText);
                }
            } catch (e) {
                console.error("Error fetching past bitácoras:", e);
            }
        };

        fetchBitacoras();

        try {
            verifyToken();
        } catch (e) {
            navigate("/login");
        }
    }, []);

    return (
        <section id="pastBits">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-25">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
                    <h1 className="text-center fs-3 fw-semibold text-black">Bitácoras Pasadas</h1>

                    {/* LIST */}
                    <div className="mx-3 my-4">
                        <ul className="list-unstyled">
                            {bitacoras.map((bitacora) => (
                                <li key={bitacora._id} className="mb-3">
                                    <BitacoraCard
                                        destino={bitacora.destino}
                                        origen={bitacora.origen}
                                        monitoreo={bitacora.monitoreo}
                                        cliente={bitacora.cliente}
                                        id_enlace={bitacora.id_enlace}
                                        id_remolque={bitacora.id_remolque}
                                        id_tracto={bitacora.id_tracto}
                                        operador={bitacora.operador}
                                        telefono={bitacora.telefono}
                                        inicioMonitoreo={bitacora.inicioMonitoreo}
                                        finalMonitoreo={bitacora.finalMonitoreo}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    );
};

export default PastBits;

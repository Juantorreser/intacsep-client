import React, {useState, useEffect} from "react";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
import {formatDate} from "../../utils/dateUtils"; // Ensure you have a utility to format dates

const PastBits = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const {user, verifyToken} = useAuth();
    const navigate = useNavigate();
    const [bitacoras, setBitacoras] = useState([]);

    useEffect(() => {
        // Fetch all bitacoras when the component mounts
        const fetchBitacoras = async () => {
            try {
                const response = await fetch(`${baseUrl}/bitacoras`);
                if (response.ok) {
                    const data = await response.json();
                    // Sort bitacoras by createdAt in descending order
                    const sortedData = data.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setBitacoras(sortedData);
                    console.log("Fetched and sorted bitácoras:", sortedData);
                } else {
                    console.error("Failed to fetch bitácoras:", response.statusText);
                }
            } catch (e) {
                console.error("Error fetching bitácoras:", e);
            }
        };

        fetchBitacoras();

        // try {
        //     verifyToken();
        // } catch (e) {
        //     navigate("/login");
        // }
    }, [baseUrl, navigate, verifyToken]);

    return (
        <section id="pastBits">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-25">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
                    <h1 className="text-center fs-3 fw-semibold text-black">Bitácoras</h1>

                    {/* Table */}
                    <div className="mx-3 my-4">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Cliente</th>
                                        <th>Tipo Monitoreo</th>
                                        <th>Operador</th>
                                        <th>Fecha Creacion</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bitacoras.map((bitacora) => (
                                        <tr key={bitacora._id}>
                                            <td>
                                                <a
                                                    href={`/bitacora/${bitacora._id}`}
                                                    className="text-decoration-none">
                                                    {bitacora.bitacora_id}
                                                </a>
                                            </td>
                                            <td>{bitacora.cliente}</td>
                                            <td>{bitacora.monitoreo}</td>
                                            <td>{bitacora.operador}</td>
                                            <td>{formatDate(bitacora.createdAt)}</td>
                                            <td>{bitacora.activa ? "Activa" : "Cerrada"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default PastBits;

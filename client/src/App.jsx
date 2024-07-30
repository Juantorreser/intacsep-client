import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import Home from "./components/Home";
import ActiveBits from "./components/Bitacoras/ActiveBits";
import PastBits from "./components/Bitacoras/PastBits";
import BitacoraDetail from "./components/Bitacoras/BitacoraDetail";
import TiposMonitoreo from "./components/Settings/TiposMonitoreo";
import UsersPage from "./components/Settings/UsersPage";
import UserRolePage from "./components/Settings/UserRolePage";
import ClientsPage from "./components/Settings/ClientsPage";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/inicio" element={<Home />}></Route>
                <Route path="/bitacoras_activas" element={<ActiveBits />}></Route>
                <Route path="/bitacoras_pasadas" element={<PastBits />}></Route>
                <Route path="/bitacora/:id" element={<BitacoraDetail />} />
                <Route path="/tipos_monitoreo" element={<TiposMonitoreo />}></Route>
                <Route path="/usuarios" element={<UsersPage />}></Route>
                <Route path="/roles" element={<UserRolePage />}></Route>
                <Route path="/clientes" element={<ClientsPage />}></Route>
            </Routes>
        </>
    );
}

export default App;

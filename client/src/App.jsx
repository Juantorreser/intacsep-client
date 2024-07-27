import "./App.scss";
import {Route, Routes} from "react-router-dom";
import Header from "./components/Header/Header";
import Login from "./components/Login/Login";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />}></Route>
                <Route path="/login" element={<Login />}></Route>
            </Routes>
        </>
    );
}

export default App;

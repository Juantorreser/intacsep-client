import React, {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext";
import {Navigate, useNavigate} from "react-router-dom";

const Login = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate(); // Get the navigate function
    const {user, login} = useAuth();
    const [isRegistered, setIsRegistered] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleForm = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(formData);
    };

    useEffect(() => {
        console.log(user);
        console.log(isRegistered);
    }, []);

    const registerUser = async (e) => {
        e.preventDefault();

        const response = await fetch(`${baseUrl}/register`, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.status === 200) {
            console.log("Registered");
            console.log(data.id);
            setIsRegistered(true);
            // login(formData.email, formData.password);
        }
    };

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
        } catch (e) {
            console.log(e);
        }
        navigate("/home");
    };

    //form Switch
    const setForm = () => {
        //Register Form
        if (!isRegistered) {
            return (
                <section id="login">
                    <div className="container col justify-content-center align-items-center">
                        <img src="./logo1.png" alt="logo" width={50} />
                        <p>Registrarse</p>
                        <form
                            onSubmit={registerUser}
                            className="d-flex flex-column justify-content-center align-items-center">
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    id="floatingInput"
                                    placeholder="name@example.com"
                                    required
                                    onChange={handleForm}
                                    value={formData.email}
                                />
                                <label htmlFor="floatingInput">Email</label>
                            </div>
                            <div className="form-floating">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    id="floatingPassword"
                                    placeholder="Password"
                                    required
                                    onChange={handleForm}
                                    value={formData.password}
                                />
                                <label htmlFor="floatingPassword">Contraseña</label>
                            </div>
                            <button type="submit" className="btn btn-primary mt-3">
                                Registrarse
                            </button>
                        </form>

                        <p className=" mt-3 registerSwitch" onClick={() => setIsRegistered(true)}>
                            Iniciar sesión
                        </p>
                        <p className=" opacity-25 mt-5">© Spotynet 2024</p>
                    </div>
                </section>
            );
        }

        //Login Form
        return (
            <section id="login">
                <div className="container col justify-content-center align-items-center">
                    <img src="./logo1.png" alt="logo" width={50} />
                    <p>Inicio de sesión</p>
                    <form
                        onSubmit={loginUser}
                        className="d-flex flex-column justify-content-center align-items-center">
                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                id="floatingInput"
                                placeholder="name@example.com"
                                required
                                value={formData.email}
                                onChange={handleForm}
                            />
                            <label htmlFor="floatingInput">Email</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={handleForm}
                            />
                            <label htmlFor="floatingPassword">Contraseña</label>
                        </div>
                        <a href="">Olvidaste tu constraseña?</a>
                        <button type="submit" className="btn btn-primary">
                            Iniciar sesión
                        </button>
                    </form>
                    <p className=" mt-3 registerSwitch" onClick={() => setIsRegistered(false)}>
                        Registrarse
                    </p>
                    <p className=" opacity-25 mt-5">© Spotynet 2024</p>
                </div>
            </section>
        );
    };

    return <> {setForm()}</>;
};

export default Login;

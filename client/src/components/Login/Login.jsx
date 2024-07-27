import React from "react";
import "./login.scss";

const Login = () => {
    return (
        <section id="login">
            <div className="container col justify-content-center align-items-center">
                <img src="./logo.png" alt="logo" width={50} />
                <p>Inicio de sesión</p>
                <form action="">
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            className="form-control"
                            id="floatingInput"
                            placeholder="name@example.com"
                        />
                        <label htmlFor="floatingInput">Email</label>
                    </div>
                    <div className="form-floating">
                        <input
                            type="password"
                            className="form-control"
                            id="floatingPassword"
                            placeholder="Password"
                        />
                        <label htmlFor="floatingPassword">Contraseña</label>
                    </div>
                </form>
                <a href="">Olvidaste tu constraseña?</a>
                <button className="btn btn-primary">Iniciar sesión</button>
                <p className=" opacity-25 mt-5">© Spotynet 2024</p>
            </div>
        </section>
    );
};

export default Login;

import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const ResetPassword = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token"); // Extract token from query params

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        console.log(token);

        const response = await fetch(`${baseUrl}/reset-password`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({token, newPassword: password}),
        });

        if (response.ok) {
            navigate("/login");
        } else {
            const data = await response.json();
            setMessage(data.message || "Error resetting password");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
            />
            <button type="submit">Reset Password</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default ResetPassword;

// UserInfoPage.jsx
import React, {useState, useEffect} from "react";
import UserRoleCard from "./UserRoleCard"; // Adjust path as needed
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const UserRolePage = () => {
    const [users, setUsers] = useState([]);
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${baseUrl}/users`);
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error("Failed to fetch users:", response.statusText);
                }
            } catch (e) {
                console.error("Error fetching users:", e);
            }
        };

        fetchUsers();
    }, []);

    const handleUserUpdate = (updatedUser) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
        );
    };

    return (
        <section id="userInfoPage">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-25">
                    <Sidebar />
                </div>

                <div className="w-100 h-100 col mt-4">
                    <h1 className="text-center fs-3 fw-semibold text-black">
                        Información de Usuarios
                    </h1>

                    <div className="mx-3 my-4">
                        {users.map((user) => (
                            <UserRoleCard key={user._id} user={user} onUpdate={handleUserUpdate} />
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    );
};

export default UserRolePage;

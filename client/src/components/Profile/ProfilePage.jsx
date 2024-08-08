import React, {useState, useEffect} from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";

const ProfilePage = ({userId, baseUrl}) => {
    const [user, setUser] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        countryKey: "",
        role: "",
    });

    useEffect(() => {
        // Fetch the user data when the component loads
        const fetchUser = async () => {
            try {
                const response = await fetch(`${baseUrl}/user/${userId}`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        console.log(user);

        fetchUser();
    }, [userId, baseUrl]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/profile/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
                credentials: "include",
            });

            if (response.ok) {
                console.log("User updated successfully");
            } else {
                console.error("Failed to update user:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    return (
        <section id="bitacoraDetail">
            <Header />
            <div className="w-100 d-flex">
                <div className="sidebar-wrapper">
                    <Sidebar />
                </div>
                <div className="content-wrapper">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                required
                                minLength="5"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">
                                First Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">
                                Last Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">
                                Phone
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={user.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="countryKey" className="form-label">
                                Country Key
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="countryKey"
                                name="countryKey"
                                value={user.countryKey}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">
                                Role
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="role"
                                name="role"
                                value={user.role}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;

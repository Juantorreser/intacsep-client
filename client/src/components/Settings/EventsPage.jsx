import React, {useState, useEffect} from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState("");
    const [editEvent, setEditEvent] = useState(null);
    const [editEventName, setEditEventName] = useState("");
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${baseUrl}/event_types`);
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                } else {
                    console.error("Failed to fetch events:", response.statusText);
                }
            } catch (e) {
                console.error("Error fetching events:", e);
            }
        };

        fetchEvents();
    }, [baseUrl]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/event_types/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                setEvents(events.filter((event) => event._id !== id));
            } else {
                console.error("Failed to delete event:", response.statusText);
            }
        } catch (e) {
            console.error("Error deleting event:", e);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newEvent) return;

        try {
            const response = await fetch(`${baseUrl}/event_types`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({eventType: newEvent}), // Update this to match the schema field
                credentials: "include",
            });

            if (response.ok) {
                const createdEvent = await response.json();
                setEvents([...events, createdEvent]);
                setNewEvent(""); // Clear the input field
            } else {
                console.error("Failed to create event:", response.statusText);
            }
        } catch (e) {
            console.error("Error creating event:", e);
        }
    };


    const handleEditClick = (event) => {
        setEditEvent(event);
        setEditEventName(event.name);
    };

    const handleEditSave = async (id) => {
        try {
            const response = await fetch(`${baseUrl}/event_types/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name: editEventName}),
                credentials: "include",
            });

            if (response.ok) {
                const updatedEvent = await response.json();
                setEvents(events.map((event) => (event._id === id ? updatedEvent : event)));
                setEditEvent(null);
                setEditEventName("");
            } else {
                console.error("Failed to update event:", response.statusText);
            }
        } catch (e) {
            console.error("Error updating event:", e);
        }
    };

    return (
        <section id="eventsPage">
            <Header />
            <div className="w-100 d-flex">
                <div className="d-none d-lg-flex w-[15%]">
                    <Sidebar />
                </div>
                <div className="w-100 h-100 col mt-4">
                    <div className="d-flex justify-content-center align-items-center mb-4">
                        <h1 className="fs-3 fw-semibold text-black m-0">Eventos</h1>
                    </div>

                    {/* Create New Event Form */}
                    <div className="mx-3 my-4">
                        <form onSubmit={handleCreate} className="mb-4">
                            <div className="form-group">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        id="newEvent"
                                        className="form-control rounded-2"
                                        value={newEvent}
                                        onChange={(e) => setNewEvent(e.target.value)}
                                        placeholder="Ingrese nuevo evento"
                                    />
                                    <div className="input-group-append ms-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary rounded-circle">
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Responsive Table */}
                    <div className="mx-3 my-4">
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre del Evento</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map((event) => (
                                        <tr key={event._id}>
                                            <td>
                                                {editEvent && editEvent._id === event._id ? (
                                                    <input
                                                        type="text"
                                                        value={editEventName}
                                                        onChange={(e) =>
                                                            setEditEventName(e.target.value)
                                                        }
                                                    />
                                                ) : (
                                                    event.eventType // Update this to match the schema field
                                                )}
                                            </td>
                                            <td className="text-end">
                                                {editEvent && editEvent._id === event._id ? (
                                                    <button
                                                        className="btn btn-success rounded-circle"
                                                        onClick={() => handleEditSave(event._id)}>
                                                        <i className="fas fa-save"></i>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-primary rounded-circle"
                                                        onClick={() => handleEditClick(event)}>
                                                        <i className="fas fa-pencil-alt"></i>
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-danger rounded-circle ms-2"
                                                    onClick={() => handleDelete(event._id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    );
};

export default EventsPage;

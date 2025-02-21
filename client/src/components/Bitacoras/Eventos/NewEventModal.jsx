import React, {useEffect, useState} from "react";
import {useAuth} from "../../../context/AuthContext";
import {useParams} from "react-router-dom";

const NewEventModal = ({edited, eventTypes}) => {
  const [bitacora, setBitacora] = useState(null);
  const {id} = useParams();
  const {verifyToken, user, setUser} = useAuth();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [selectedTransportes, setSelectedTransportes] = useState([]);
  const [transportes, setTransportes] = useState(bitacora?.transportes || []);
  const [units, setUnits] = useState([]);
  const token = import.meta.env.VITE_WIALON_TOKEN;

  const [newEvent, setNewEvent] = useState({
    nombre: "",
    descripcion: "",
    ubicacion: "",
    ultimo_posicionamiento: "",
    velocidad: "",
    coordenadas: "",
    frecuencia: 0,
    registrado_por: `${user?.firstName} ${user?.lastName}`,
    transportes: transportes,
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    const init = async () => {
      try {
        const data = await verifyToken();
        setUser(data);
      } catch (e) {
        console.log("Error verifying token or fetching user:", e);
        navigate("/login");
      }
    };

    fetchBitacora();
    init();
  }, [token]);

  const fetchBitacora = async () => {
    try {
      const response = await fetch(`${baseUrl}/bitacora/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();

        if (edited || edited.edited) {
          setBitacora(data.edited_bitacora);
          // setEditedBitacora(data.edited_bitacora);
          setTransportes(data.edited_bitacora.transportes);
          setSelectedTransportes(data.transportes);
        } else if (!edited && data.edited_bitacora) {
          setBitacora(data);
          // setEditedBitacora(data.edited_bitacora);
          setTransportes(data.transportes);
          setSelectedTransportes(data.transportes);
        } else {
          setBitacora(data);
          // setEditedBitacora(data);
          setTransportes(data.transportes);
          setSelectedTransportes(data.transportes);
        }
      } else {
        console.error("Failed to fetch bitácora:", response.statusText);
      }
    } catch (e) {
      console.error("Error fetching bitácora:", e);
    }
  };

  const getUnitInfo = async (transporteId) => {
    console.log(transporteId);
    console.log(units);

    // Buscar si existe una unidad con el id igual a transporteId
    const unidadEncontrada = units.find((unit) => unit.id == transporteId);

    if (unidadEncontrada) {
      const sess = window.wialon.core.Session.getInstance();
      const unit = sess.getItems("avl_unit").find((u) => u.getId() === unidadEncontrada.id);

      if (unit) {
        // Obtener la posición de la unidad
        const pos = unit.getPosition();
        let ubicacion = "";

        const time = window.wialon.util.DateTime.formatTime(pos.t);

        // Usar await para esperar la respuesta de la dirección
        try {
          const address = await getAddressFromCoordinates(pos.x, pos.y);
          ubicacion = address;
          ubicacion = Array.isArray(ubicacion) ? ubicacion.join(", ") : ubicacion;
        } catch (error) {
          console.error("Error al obtener la dirección:", error);
        }

        const velocidad = pos ? pos.s : ""; // Velocidad
        const coordenadas = pos ? `${pos.x}, ${pos.y}` : ""; // Coordenadas
        const ultimo_posicionamiento = pos ? window.wialon.util.DateTime.formatTime(pos.t) : ""; // Último mensaje (duración)

        setNewEvent((prev) => ({
          ...prev,
          ubicacion: ubicacion || "",
          velocidad: velocidad || 50, // Si no hay velocidad, asignar valor por defecto
          coordenadas: coordenadas || "",
          ultimo_posicionamiento: ultimo_posicionamiento || "",
          nombre: unidadEncontrada.name || "",
          descripcion: unidadEncontrada.description || "",
          frecuencia: 0, // Lo dejamos como 0 si no hay un valor específico
          registrado_por: `${user?.firstName} ${user?.lastName}`,
          transportes: transportes,
        }));
      } else {
        setNewEvent((prev) => ({
          ...prev,
          ubicacion: "",
          velocidad: "",
          coordenadas: "",
          ultimo_posicionamiento: "",
          nombre: "",
          descripcion: "",
          frecuencia: 0,
          registrado_por: `${user?.firstName} ${user?.lastName}`,
          transportes: transportes,
        }));
      }
    } else {
      setNewEvent((prev) => ({
        ...prev,
        ubicacion: "",
        velocidad: "",
        coordenadas: "",
        ultimo_posicionamiento: "",
        nombre: "",
        descripcion: "",
        frecuencia: 0,
        registrado_por: `${user?.firstName} ${user?.lastName}`,
        transportes: transportes,
      }));
    }
  };

  // Función asincrónica para obtener la dirección a partir de las coordenadas
  const getAddressFromCoordinates = (longitude, latitude) => {
    return new Promise((resolve, reject) => {
      window.wialon.util.Gis.getLocations([{lon: longitude, lat: latitude}], (code, address) => {
        if (!code) {
          resolve(address); // Si se obtiene la dirección correctamente
        } else {
          reject("Dirección no encontrada");
        }
      });
    });
  };

  const handleCheckboxChange = (e) => {
    const {value, checked} = e.target;
    const transporteId = value;
    const transporteToAdd = bitacora.transportes.find(
      (transporte) => String(transporte.id) === transporteId
    );

    if (value === "all") {
      // Manejo de selección "Todos"
      if (checked) {
        setSelectedTransportes(bitacora.transportes);
      } else {
        setSelectedTransportes([]);
      }
    } else {
      setSelectedTransportes((prev) => {
        const newSelection = checked
          ? [...prev, transporteToAdd]
          : prev.filter((transporte) => transporte.id !== transporteToAdd.id);

        // Si al final queda solo un transporte seleccionado, ejecutar getUnitInfo
        if (newSelection.length === 1) {
          getUnitInfo(newSelection[0].id);
        }

        return newSelection;
      });
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setNewEvent((prev) => ({...prev, [name]: value}));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log(transportes);

  //   if (selectedTransportes.length === 0) {
  //     alert("Favor de seleccionar un transporte.");
  //     return; // Prevent form submission if no checkboxes are selected
  //   }

  //   try {
  //     const response = await fetch(`${baseUrl}/bitacora/${id}/event`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         nombre: newEvent.nombre, // Ensure this matches the backend field
  //         descripcion: newEvent.descripcion,
  //         ubicacion: newEvent.ubicacion,
  //         ultimo_posicionamiento: newEvent.ultimo_posicionamiento,
  //         velocidad: newEvent.velocidad,
  //         coordenadas: newEvent.coordenadas,
  //         registrado_por: `${user.firstName} ${user.lastName}`,
  //         frecuencia: newEvent.frecuencia,
  //         transportes: selectedTransportes,
  //       }),
  //       credentials: "include",
  //     });
  //     if (response.ok) {
  //       const updatedBitacora = await response.json();
  //       setBitacora(updatedBitacora);
  //       setNewEvent({
  //         nombre: "",
  //         descripcion: "",
  //         ubicacion: "",
  //         ultimo_posicionamiento: "",
  //         velocidad: "",
  //         coordenadas: "",
  //       });

  //       if (bitacora.status === "nueva" && newEvent.nombre === "Validación") {
  //         try {
  //           const response = await fetch(`${baseUrl}/bitacora/${id}/status`, {
  //             method: "PATCH",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               status: "validada",
  //               inicioMonitoreo: new Date().toISOString(), // Set the start time
  //             }),
  //             credentials: "include",
  //           });
  //           if (response.ok) {
  //             const updatedBitacora = await response.json();
  //             setBitacora(updatedBitacora);
  //           } else {
  //             console.error("Failed to start bitácora:", response.statusText);
  //           }
  //         } catch (e) {
  //           console.error("Error starting bitácora:", e);
  //         }
  //       }
  //     } else {
  //       console.error("Failed to add event:", response.statusText);
  //     }
  //   } catch (e) {
  //     console.error("Error adding event:", e);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedTransportes.length === 0) {
      alert("Favor de seleccionar un transporte.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/bitacora/${id}/event`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: newEvent.nombre,
          descripcion: newEvent.descripcion,
          ubicacion: newEvent.ubicacion,
          ultimo_posicionamiento: newEvent.ultimo_posicionamiento,
          velocidad: newEvent.velocidad,
          coordenadas: newEvent.coordenadas,
          registrado_por: `${user.firstName} ${user.lastName}`,
          frecuencia: newEvent.frecuencia,
          transportes: selectedTransportes,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const updatedBitacora = await response.json();
        setBitacora(updatedBitacora);
        setNewEvent({
          nombre: "",
          descripcion: "",
          ubicacion: "",
          ultimo_posicionamiento: "",
          velocidad: "",
          coordenadas: "",
        });

        const eventosValidacion = updatedBitacora.eventos.filter(
          (evento) => evento.nombre === "Validación"
        );

        selectedTransportes.forEach(async (transporte) => {
          const hasValidacion = eventosValidacion.some((evento) =>
            evento.transportes.some((t) => t.id === transporte.id)
          );

          if (hasValidacion) {
            try {
              const statusResponse = await fetch(`${baseUrl}/bitacora/${id}/status`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  status: "validada",
                  inicioMonitoreo: new Date().toISOString(),
                }),
                credentials: "include",
              });

              if (!statusResponse.ok) {
                console.error("Failed to update status:", statusResponse.statusText);
              }
            } catch (e) {
              console.error("Error updating status:", e);
            }
          }
        });
      } else {
        console.error("Failed to add event:", response.statusText);
      }
    } catch (e) {
      console.error("Error adding event:", e);
    }
  };

  return (
    <div
      className="modal fade"
      id="eventModal"
      tabIndex="-1"
      aria-labelledby="eventModalLabel"
      aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="eventModalLabel">
              Añadir Evento
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="transportes" className="form-label">
                  Transportes
                </label>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="allTransportes"
                    name="transportes"
                    value="all"
                    onChange={handleCheckboxChange}
                    checked={
                      bitacora?.transportes &&
                      selectedTransportes.length === bitacora.transportes.length
                    }
                  />

                  <label className="form-check-label" htmlFor="allTransportes">
                    Todos
                  </label>
                </div>
                {bitacora?.transportes?.map((transporte) => {
                  const transporteId = transporte.id.includes("_")
                    ? transporte.id.split("_")[1] // Obtiene la parte después del '_'
                    : transporte.id; // Mantiene el ID original

                  return (
                    <div className="form-check" key={transporte.id}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`transporte-${transporte.id}`}
                        name="transportes"
                        value={transporte.id}
                        onChange={handleCheckboxChange}
                        checked={selectedTransportes.includes(transporte)}
                      />
                      <label className="form-check-label" htmlFor={`transporte-${transporte.id}`}>
                        {`${bitacora?.bitacora_id}.${transporteId}`}
                      </label>
                    </div>
                  );
                })}
              </div>
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">
                  Tipo de Evento
                </label>
                <select
                  id="nombre"
                  name="nombre"
                  className="form-select"
                  value={newEvent.nombre}
                  onChange={handleChange}
                  required>
                  <option value="">Seleccionar tipo de evento</option>

                  {(() => {
                    // Filtrar eventos con nombre "Validación"
                    const eventosValidacion =
                      bitacora?.eventos.filter((evento) => evento.nombre === "Validación") || [];

                    // Filtrar eventos con nombre "Inicio de recorrido"
                    const eventosInicioRecorrido =
                      bitacora?.eventos.filter(
                        (evento) => evento.nombre === "Inicio de recorrido"
                      ) || [];

                    // Filtrar eventos con nombre "Arribo a destino"
                    const eventosArriboDestino =
                      bitacora?.eventos.filter((evento) => evento.nombre === "Arribo a destino") ||
                      [];

                    // Extraer IDs de transportes en eventos "Validación"
                    const transportesConValidacion = new Set(
                      eventosValidacion.flatMap((evento) => evento.transportes.map((t) => t.id))
                    );

                    // Extraer IDs de transportes en eventos "Inicio de recorrido"
                    const transportesConInicioRecorrido = new Set(
                      eventosInicioRecorrido.flatMap((evento) =>
                        evento.transportes.map((t) => t.id)
                      )
                    );

                    // Extraer IDs de transportes en eventos "Arribo a destino"
                    const transportesConArriboDestino = new Set(
                      eventosArriboDestino.flatMap((evento) => evento.transportes.map((t) => t.id))
                    );

                    // Verificar si TODOS los selectedTransportes están en eventos de "Validación"
                    const allSelectedTransportesInValidacion = selectedTransportes.every((t) =>
                      transportesConValidacion.has(t.id)
                    );

                    // Verificar si TODOS los selectedTransportes están en eventos de "Inicio de recorrido"
                    const allSelectedTransportesInInicioRecorrido = selectedTransportes.every((t) =>
                      transportesConInicioRecorrido.has(t.id)
                    );

                    // Verificar si TODOS los selectedTransportes están en eventos de "Arribo a destino"
                    const allSelectedTransportesInArriboDestino = selectedTransportes.every((t) =>
                      transportesConArriboDestino.has(t.id)
                    );

                    if (allSelectedTransportesInValidacion) {
                      if (allSelectedTransportesInInicioRecorrido) {
                        // Si todos los transportes están en "Validación" y "Inicio de recorrido"
                        return eventTypes
                          .filter(
                            (eventType) =>
                              allSelectedTransportesInArriboDestino ||
                              eventType.eventType !== "Cierre de servicio"
                          )
                          .map((eventType) => (
                            <option key={eventType._id} value={eventType.eventType}>
                              {eventType.eventType}
                            </option>
                          ));
                      } else {
                        // Si todos los transportes están en "Validación" pero no en "Inicio de recorrido", mostrar solo "Inicio de recorrido"
                        return <option value="Inicio de recorrido">Inicio de recorrido</option>;
                      }
                    }

                    // Si algún transporte no está en "Validación", solo permitir "Validación"
                    return <option value="Validación">Validación</option>;
                  })()}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">
                  Descripcion
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  className="form-control"
                  value={newEvent.descripcion}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="ubicacion" className="form-label">
                  Ubicación
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ubicacion"
                  name="ubicacion"
                  value={newEvent.ubicacion}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* <div className="mb-3">
                <label htmlFor="duracion" className="form-label">
                  Duración
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="duracion"
                  name="duracion"
                  value={newEvent.duracion}
                  onChange={handleChange}
                  required
                />
              </div> */}
              <div className="mb-3">
                <label htmlFor="ultimo_posicionamiento" className="form-label">
                  Último Posicionamiento
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="ultimo_posicionamiento"
                  name="ultimo_posicionamiento"
                  value={newEvent.ultimo_posicionamiento}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="velocidad" className="form-label">
                  Velocidad
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="velocidad"
                  name="velocidad"
                  value={newEvent.velocidad}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="coordenadas" className="form-label">
                  Coordenadas
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="coordenadas"
                  name="coordenadas"
                  value={newEvent.coordenadas}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="frecuencia" className="form-label">
                  Frecuencia
                </label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  max="99"
                  id="frecuencia"
                  name="frecuencia"
                  value={newEvent.frecuencia}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="text-end">
                <button type="button" className="btn btn-danger m-2" data-bs-dismiss="modal">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success" data-bs-dismiss="modal">
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEventModal;

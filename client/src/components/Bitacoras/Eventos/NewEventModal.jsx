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
    duracion: "",
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
        const data = await verifyToken(); // Ensure user is verified
        setUser(data);
      } catch (e) {
        console.log("Error verifying token or fetching user:", e);
        navigate("/login");
      }

      console.log("AAA");

      //Wialon login
      const sess = window.wialon.core.Session.getInstance();
      sess.initSession("https://hst-api.wialon.com");
      sess.loginToken(token, "", (code) => {
        if (code) {
          console.log(`Login failed: ${window.wialon.core.Errors.getErrorText(code)}`);
        } else {
          console.log("Logged in successfully!");
          fetchAllUnits(sess);
        }
      });
    };

    const fetchAllUnits = async (sess, retries = 3, delay = 1000) => {
      try {
        const flags =
          window.wialon.item.Item.dataFlag.base | window.wialon.item.Unit.dataFlag.lastMessage;

        sess.loadLibrary("itemIcon");

        // Ensure the library is loaded
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject("Library load timeout"), 5000);
          sess.updateDataFlags([{type: "type", data: "avl_unit", flags, mode: 0}], (code) => {
            clearTimeout(timeout);
            if (code) {
              reject(window.wialon.core.Errors.getErrorText(code));
            } else {
              resolve();
            }
          });
        });

        const fetchedUnits = sess.getItems("avl_unit") || [];
        const unitDetails = fetchedUnits.map((unit) => ({id: unit.getId(), name: unit.getName()}));
        setUnits(unitDetails); // Store the fetched units

        console.log("Unidades obtenidas:", unitDetails); // 👈 Debugging point
      } catch (error) {
        console.error("Error al obtener unidades, reintentando...", error);
        if (retries > 0) {
          console.log(`Retrying in ${delay}ms...`);
          setTimeout(() => fetchAllUnits(sess, retries - 1, delay), delay);
        } else {
          console.log("Max retries reached, failing...");
          setUnits([]); // Reset units on failure
        }
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
    // Extraer el ID correcto: tomar la parte antes del '_'
    const formattedTransporteId = transporteId.includes("_")
      ? transporteId.split("_")[0]
      : transporteId;

    console.log("ID recibido:", transporteId);
    console.log("ID formateado:", formattedTransporteId);
    console.log(units);

    // Buscar si existe una unidad con el id igual al ID formateado
    const unidadEncontrada = units.find((unit) => unit.id == formattedTransporteId);

    if (unidadEncontrada) {
      const sess = window.wialon.core.Session.getInstance();
      const unit = sess.getItems("avl_unit").find((u) => u.getId() === unidadEncontrada.id);

      if (unit) {
        // Obtener la posición de la unidad
        const pos = unit.getPosition();
        let ubicacion = "";

        const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        const timeDiffInSeconds = pos ? currentTime - pos.t : 0;
        const duracion = formatDuration(timeDiffInSeconds); // Convertir a formato "20h ago"

        // Usar await para esperar la respuesta de la dirección
        try {
          const address = await getAddressFromCoordinates(pos.x, pos.y);
          ubicacion = Array.isArray(address) ? address.join(", ") : address;
        } catch (error) {
          console.error("Error al obtener la dirección:", error);
        }

        const velocidad = pos ? pos.s : ""; // Velocidad
        const coordenadas = pos ? `${pos.y}, ${pos.x}` : ""; // Coordenadas
        const ultimo_posicionamiento = pos ? window.wialon.util.DateTime.formatTime(pos.t) : ""; // Último mensaje

        setNewEvent((prev) => ({
          ...prev,
          ubicacion: ubicacion || "",
          velocidad: velocidad || 0, // Si no hay velocidad, asignar valor por defecto
          coordenadas: coordenadas || "",
          ultimo_posicionamiento: ultimo_posicionamiento || "",
          duracion: duracion || "", // Duración en formato "20h ago"
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
          duracion: "",
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
        duracion: "",
        nombre: "",
        descripcion: "",
        frecuencia: 0,
        registrado_por: `${user?.firstName} ${user?.lastName}`,
        transportes: transportes,
      }));
    }
  };

  // Función para formatear el tiempo transcurrido en "X time ago"
  const formatDuration = (seconds) => {
    if (seconds < 60) return `Hace ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days}d`;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newEvent);

    if (selectedTransportes.length === 0) {
      alert("Favor de seleccionar un transporte.");
      return;
    }

    // Determine if the event is "Validación" or "Cierre de servicio"
    const isValidacion = newEvent.nombre === "Validación";
    const isCierreDeServicio = newEvent.nombre === "Cierre de servicio";
    const currentDate = new Date().toISOString();

    // Update bitacora.transportes with inicioMonitoreo or finalMonitoreo
    const updatedTransportes = bitacora.transportes.map((transporte) => {
      const matchingTransporte = selectedTransportes.find((t) => t.id === transporte.id);
      if (matchingTransporte) {
        return {
          ...transporte,
          inicioMonitoreo: isValidacion ? currentDate : transporte.inicioMonitoreo || null,
          finalMonitoreo: isCierreDeServicio ? currentDate : transporte.finalMonitoreo || null,
        };
      }
      return transporte;
    });

    const updatedBitacora = {...bitacora, transportes: updatedTransportes};

    //Update transportes times
    try {
      const response = await fetch(`${baseUrl}/bitacora/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBitacora), // Use the updated bitacora
        credentials: "include",
      });

      if (response.ok) {
        const responseData = await response.json();
        setBitacora(responseData); // Ensure frontend reflects changes from backend
        setIsEdited(true);
        setEditModalVisible(false);
      } else {
        console.error("Failed to edit bitácora:", response.statusText);
      }
    } catch (e) {
      console.error("Error editing bitácora:", e);
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
          duracion: newEvent.duracion,
          registrado_por: `${user.firstName} ${user.lastName}`,
          frecuencia: newEvent.frecuencia,
          transportes: updatedTransportes, // Send updated transportes
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
          duracion: "",
          ultimo_posicionamiento: "",
          velocidad: "",
          coordenadas: "",
        });

        // Update Status
        if (isValidacion && bitacora.status === "nueva") {
          try {
            const statusResponse = await fetch(`${baseUrl}/bitacora/${id}/status`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "validada",
                inicioMonitoreo: currentDate,
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
                        {`${transporteId} - ${transporte.tracto.eco}`}
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
              <div className="mb-3">
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
              </div>
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

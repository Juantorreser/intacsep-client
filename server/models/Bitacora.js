import mongoose from "mongoose";

const EventoSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
    },
    {timestamps: true} // This will automatically add `createdAt` and `updatedAt` fields
);

const BitSchema = new mongoose.Schema(
    {
        bitacora_id: {type: String, required: true, unique: true},
        destino: {type: String, required: true},
        origen: {type: String, required: true},
        monitoreo: {type: String, required: true},
        cliente: {type: String, required: true},
        enlace: {type: String, required: true},
        id_acceso: {type: String, required: true},
        contra_acceso: {type: String, required: true},
        placa_remolque: {type: String, required: true},
        placa_tracto: {type: String, required: true},
        eco_remolque: {type: String, required: true},
        eco_tracto: {type: String, required: true},
        operador: {type: String, required: true},
        telefono: {type: String, required: true},
        inicioMonitoreo: {type: Date},
        finalMonitoreo: {type: Date},
        status: {type: String, default: "creada", required: true},
        eventos: [EventoSchema],
    },
    {timestamps: true}
);

const Bitacora = mongoose.model("Bitacora", BitSchema);
export default Bitacora;

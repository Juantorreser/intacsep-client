import mongoose, {mongo} from "mongoose";

const BitSchema = new mongoose.Schema(
    {
        destino: {type: String, required: true},
        origen: {type: String, required: true},
        monitoreo: {type: String, required: true},
        cliente: {type: String, required: true},
        id_enlace: {type: String, required: true},
        id_remolque: {type: String, required: true},
        id_tracto: {type: String, required: true},
        operador: {type: String, required: true},
        telefono: {type: String, required: true},
        inicioMonitoreo: {type: Date},
        finalMonitoreo: {type: Date},
        activa: {type: Boolean, default: true},
        iniciada: {type: Boolean, default: false},
    },
    {timestamps: true}
);

const Bitacora = mongoose.model("Bitacora", BitSchema);
export default Bitacora;

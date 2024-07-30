// models/Client.js
import mongoose, {mongo} from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        alcaldia: String,
        calle: String,
        ciudad: String,
        clave_pais: String,
        codigo_postal: String,
        colonia: String,
        email: {type: String, required: true},
        ID_Cliente: String,
        num_ext: String,
        num_int: String,
        razon_social: String,
        RFC: String,
        telefono: String,
        nombres: {type: String, required: true},
        apellidos: {type: String, required: true},
        pais: String,
    },
    {timestamps: true}
);

const Client = mongoose.model("Client", clientSchema);
export default Client;

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Bitacora from "./models/Bitacora.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import BitSequence from "./models/BitSequence.js";
import Monitoreo from "./models/TipoMonitoreo.js";
import Client from "./models/Cliente.js";
import EventType from "./models/EventType.js";
import Role from "./models/Role.js";
import ClientSequence from "./models/ClientSequence.js";
import Destino from "./models/Destino.js";
import Origen from "./models/Origen.js";
import Operador from "./models/Operador.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;

//midleware
const allowedOrigins = [
    "https://intacsep.spotynet.com", // Production
    "http://localhost:5173", // Development
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or Postman)
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
);

app.use(express.json());
app.use(cookieParser());

// //Create Custom Middleware to retreive Token Data
// app.use((req, res, next) => {
//     // Skip requests for login, logout, and refresh_token
//     if (
//         req.path === "/login" ||
//         req.path === "/logout" ||
//         req.path === "/refresh_token" ||
//         req.path === "/register" ||
//         (req.method === "GET" && req.path != "/user")
//     ) {
//         return next();
//     }

//     const token = req.cookies.access_token; // Retrieve token after the path check
//     req.session = {user: null}; // Initialize session

//     // Check if the token exists
//     if (!token) {
//         console.log("Token is undefined");
//         return res.status(401).json({message: "Unauthorized: Token missing"});
//     }

//     try {
//         const data = jwt.verify(token, JWT_SECRET); // Verify the token
//         req.session.user = data.user; // Store user data in session
//     } catch (e) {
//         console.log(e);
//         req.session.user = null;
//         return res.status(401).json({message: "Unauthorized: Invalid token"}); // Return response on error
//     }

//     next(); // Proceed to the next middleware
// });

//mongoose connection
mongoose.connect(process.env.MONGO_URI);

app.get("/", (req, res) => {
    res.send(`Node.js version: ${process.version}`);
});

app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email: email});

        if (!user) {
            throw new Error("User Does Not Exist");
        }

        // Compare passwords
        const checkPwd = await bcrypt.compare(password, user.password);
        if (!checkPwd) {
            throw new Error("Incorrect Password");
        }

        // Remove Password from return object
        const publicUser = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
        };

        // Create Access Token
        const accessToken = jwt.sign({user: publicUser}, JWT_SECRET, {
            expiresIn: "15m",
        });

        // Create Refresh Token
        const refreshToken = jwt.sign({id: user.id, email: user.email}, JWT_SECRET_REFRESH, {
            expiresIn: "5d",
        });

        // Save tokens in cookies
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: true,
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
        });

        user.refresh_token = refreshToken;
        await user.save();

        res.json({user: publicUser});
    } catch (e) {
        console.error(e);
        res.status(500).json({error: "An error occurred"});
    }
});

app.post("/register", async (req, res) => {
    try {
        const {email, password, phone, firstName, lastName} = req.body;

        //   Check if user already exists
        const userExists = await User.findOne({email: email});
        if (userExists) {
            throw new Error("Email Already Registered");
        }

        //hash Password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //newUser
        const newUser = new User({email, password: hashedPassword, firstName, lastName, phone});
        await newUser.save();
        res.status(200).json({id: newUser.id});
    } catch (e) {
        res.status(401).json({message: `${e}`});
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.send("Successfull").status(200);
});

app.post("/protected", (req, res) => {
    const {user} = req.session;
    if (!user) return res.send("Access Denied").status(401);
    res.json({user: user}).status(200);
});

app.post("/refresh_token", async (req, res) => {
    //create new access token
    try {
        const {refresh_token} = req.cookies;

        if (!refresh_token) return res.status(403).json({message: "No Token Refreshed"});

        const data = jwt.verify(refresh_token, JWT_SECRET_REFRESH);
        //Check if user exists
        const user = await User.findById(data.id);
        if (!user) throw new Error("username does not exists");

        //Remove Password from return object
        const publicUser = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
        };

        const newAccessToken = jwt.sign({user: publicUser}, JWT_SECRET, {
            expiresIn: "15m",
        });

        //save tokens in cookie
        res.clearCookie("access_token");
        res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        res.json({message: "Access Token Refreshed", token: newAccessToken});
    } catch (e) {
        res.status(403).json({message: "No Token Refreshed"});
    }
});

app.get("/user", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (e) {
        console.log(e);
    }
});

app.post("/user/:id", async (req, res) => {
    const {id} = req.params;
    const data = req.body;

    if (data.password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        await User.updateOne({email: id}, {password: hashedPassword});
    }

    try {
        const userToUpdate = await User.updateOne(
            {email: id},
            {
                name: data.name,
                username: data.username,
                phone: data.phone,
                address: {
                    city: data.city,
                    street: data.street,
                    unit: data.unit,
                    zip: data.zipCode,
                },
            }
        );

        console.log(userToUpdate);
        res.status(200).json({message: "User Updated"});
    } catch (e) {
        console.log(e);
        res.json({message: "User NOT Updated"});
    }
});

app.patch("/user/:id", async (req, res) => {
    const {id} = req.params;
    const updates = req.body;

    try {
        const user = await User.updateOne(
            {email: id},
            {
                admin: updates.admin,
            }
        );
        if (!user) {
            return res.status(404).send({error: "User not found"});
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({error: error.message});
    }
});

app.delete("/user/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const user = await User.deleteOne({email: id});
        if (!user) {
            return res.status(404).send({error: "User not found"});
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({error: error.message});
    }
});

app.get("/bitacoras", async (req, res) => {
    try {
        const bitacoras = await Bitacora.find();
        res.status(200).json(bitacoras);
    } catch (e) {
        console.error("Error fetching  bitácoras:", e);
        res.status(500).json({error: "An error occurred while fetching past bitácoras."});
    }
});

app.post("/bitacora", async (req, res) => {
    const data = req.body;

    try {
        // Fetch and update the sequence number
        const sequence = await BitSequence.findOneAndUpdate(
            {name: "bitacora_id"},
            {$inc: {sequence_value: 1}},
            {new: true, upsert: true} // Create if not exists
        );

        const sequenceNumber = sequence.sequence_value.toString().padStart(6, "0");

        // Create new Bitacora instance with updated data structure
        const newItem = new Bitacora({
            bitacora_id: sequenceNumber,
            folio_servicio: data.folio_servicio,
            linea_transporte: data.linea_transporte,
            destino: data.destino,
            origen: data.origen,
            monitoreo: data.monitoreo,
            cliente: data.cliente,
            enlace: data.enlace,
            id_acceso: data.id_acceso,
            contra_acceso: data.contra_acceso,
            remolque: {
                eco: data.remolque?.eco,
                placa: data.remolque?.placa,
                color: data.remolque?.color,
                capacidad: data.remolque?.capacidad,
                sello: data.remolque?.sello,
            },
            tracto: {
                eco: data.tracto?.eco,
                placa: data.tracto?.placa,
                marca: data.tracto?.marca,
                modelo: data.tracto?.modelo,
                color: data.tracto?.color,
                tipo: data.tracto?.tipo,
            },
            operador: data.operador,
            telefono: data.telefono,
            inicioMonitoreo: data.inicioMonitoreo ? new Date(data.inicioMonitoreo) : null,
            finalMonitoreo: data.finalMonitoreo ? new Date(data.finalMonitoreo) : null,
            status: data.status || "creada",
            eventos: data.eventos || [],
        });

        await newItem.save();
        res.status(201).send(newItem);
    } catch (err) {
        console.error("Error creating bitacora:", err);
        res.status(500).send("Error creating bitacora");
    }
});

app.get("/bitacora/:id", async (req, res) => {
    try {
        const bitacora = await Bitacora.findById(req.params.id);
        if (!bitacora) {
            return res.status(404).json({message: "Bitacora not found"});
        }
        res.json(bitacora);
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
});

app.patch("/bitacora/:id/event", async (req, res) => {
    const {id} = req.params;
    const {
        nombre,
        descripcion,
        ubicacion,
        ultimo_posicionamiento,
        velocidad,
        coordenadas,
        registrado_por,
    } = req.body;

    try {
        // Find the bitacora by its ID
        const bitacora = await Bitacora.findById(id);
        if (!bitacora) {
            return res.status(404).json({message: "Bitacora not found"});
        }

        // Create a new event
        const newEvent = {
            nombre,
            descripcion, // Make sure this matches what is expected
            ubicacion,
            ultimo_posicionamiento,
            velocidad,
            coordenadas,
            registrado_por,
        };

        // Add the new event to the bitacora's eventos array
        bitacora.eventos.push(newEvent);

        // Save the updated bitacora
        await bitacora.save();

        // Respond with the updated bitacora
        res.status(200).json(bitacora);
    } catch (error) {
        console.error("Error adding event:", error);
        res.status(500).json({message: "Internal server error"});
    }
});

// Endpoint to start a bitacora
app.patch("/bitacora/:id/start", async (req, res) => {
    try {
        const bitacora = await Bitacora.findById(req.params.id);
        if (!bitacora) {
            return res.status(404).json({message: "Bitacora not found"});
        }

        const date = new Date();
        bitacora.iniciada = true;
        bitacora.inicioMonitoreo = date;
        await bitacora.save();

        res.json(bitacora);
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
});

// Endpoint to finish a bitacora
app.patch("/bitacora/:id/finish", async (req, res) => {
    try {
        const bitacora = await Bitacora.findById(req.params.id);
        if (!bitacora) {
            return res.status(404).json({message: "Bitacora not found"});
        }
        const date = new Date();
        bitacora.activa = false;
        bitacora.finalMonitoreo = date;
        await bitacora.save();

        res.json(bitacora);
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
});

app.patch("/bitacora/:id/status", async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;

        const bitacora = await Bitacora.findById(id);
        if (!bitacora) return res.status(404).json({message: "Bitacora not found"});

        bitacora.status = status;
        await bitacora.save();

        res.json(bitacora);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Monitoreos
app.get("/monitoreos", async (req, res) => {
    try {
        const monitoreos = await Monitoreo.find();
        res.status(200).json(monitoreos);
    } catch (error) {
        console.error("Error fetching monitoreos:", error);
        res.status(500).json({message: "Internal server error"});
    }
});

app.delete("/monitoreos/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const result = await Monitoreo.findByIdAndDelete(id);
        if (result) {
            res.status(200).json({message: "Monitoreo deleted successfully"});
        } else {
            res.status(404).json({message: "Monitoreo not found"});
        }
    } catch (error) {
        console.error("Error deleting monitoreo:", error);
        res.status(500).json({message: "Internal server error"});
    }
});

app.post("/monitoreos", async (req, res) => {
    const {tipoMonitoreo} = req.body;
    if (!tipoMonitoreo) {
        return res.status(400).json({message: "Tipo de monitoreo is required"});
    }

    try {
        const newMonitoreo = new Monitoreo({tipoMonitoreo});
        const savedMonitoreo = await newMonitoreo.save();
        res.status(201).json(savedMonitoreo);
    } catch (error) {
        console.error("Error creating monitoreo:", error);
        res.status(500).json({message: "Internal server error"});
    }
});

//USERS
// GET users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//CREATE users
app.post("/users", async (req, res) => {
    const {email, password, firstName, lastName, phone, countryKey, role} = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({message: "Email Already Registered"});
        }

        // Hash Password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create and save the new user
        const newUser = new User({
            email,
            password: hashedPassword, // Ensure this matches your schema
            firstName,
            lastName,
            phone,
            countryKey,
            role,
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// DELETE /users/:id
app.delete("/users/:id", async (req, res) => {
    const {id} = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//UPDATE user
app.put("/users/:id", async (req, res) => {
    const {email, password, firstName, lastName, phone, countryKey, role} = req.body;

    try {
        const updateData = {email, firstName, lastName, phone, countryKey, role};

        // Hash the password if it is provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {new: true});

        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        res.json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({message: "Server error"});
    }
});

//CLIENTS
// Get all clients
app.get("/clients", async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Create a new client
app.post("/clients", async (req, res) => {
    try {
        // Get the next sequence value
        const nextID = await ClientSequence.findOneAndUpdate(
            {name: "Client_id"},
            {$inc: {sequence_value: 1}},
            {new: true, upsert: true}
        );

        // Format the ID as a 6-digit number with leading zeros
        const formattedID = nextID.sequence_value.toString().padStart(6, "0");

        // Add formatted ID to request body
        const clientData = {...req.body, ID_Cliente: formattedID};

        // Create new client with ID_Cliente
        const client = new Client(clientData);
        const newClient = await client.save();

        // Respond with created client
        res.status(201).json(newClient);
    } catch (error) {
        // Handle errors
        res.status(400).json({message: error.message});
    }
});

// Update a client
app.put("/clients/:id", async (req, res) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!updatedClient) {
            return res.status(404).json({message: "Client not found"});
        }
        res.json(updatedClient);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Delete a client
app.delete("/clients/:id", async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            return res.status(404).json({message: "Client not found"});
        }
        res.json({message: "Client deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//EVENTS
app.get("/event_types", async (req, res) => {
    try {
        const eventsTypes = await EventType.find();
        res.json(eventsTypes);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.put("/event_types/:id", async (req, res) => {
    try {
        const updatedEvent = await EventType.findByIdAndUpdate(
            req.params.id,
            {EventType: req.body.name},
            {new: true} // Return the updated document
        );
        if (!updatedEvent) return res.status(404).json({message: "Event not found"});
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

app.post("/event_types", async (req, res) => {
    const event = new EventType({
        eventType: req.body.eventType, // Update this to match the schema field
    });
    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

app.delete("/event_types/:id", async (req, res) => {
    try {
        const result = await EventType.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({message: "Event not found"});
        res.json({message: "Event deleted"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

//ROLES
app.get("/roles", async (req, res) => {
    try {
        // Fetch all roles from the database
        const roles = await Role.find();
        // Send the roles as JSON response
        res.json(roles);
    } catch (error) {
        // Handle errors and send appropriate response
        console.error("Error fetching roles:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
});

// POST a new role
app.post("/roles", async (req, res) => {
    const role = new Role({
        name: req.body.name,
        bitacoras: req.body.bitacoras,
        tipos_de_monitoreo: req.body.tipos_de_monitoreo,
        eventos: req.body.eventos,
        clientes: req.body.clientes,
        usuarios: req.body.usuarios,
        roles: req.body.roles,
    });

    try {
        const newRole = await role.save();
        res.status(201).json(newRole);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// PUT update a role
app.put("/roles/:id", async (req, res) => {
    try {
        const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(updatedRole);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

app.get("/roles/:roleName", async (req, res) => {
    try {
        const roleName = req.params.roleName;
        console.log(roleName);
        const role = await Role.findOne({name: roleName});

        if (!role) {
            return res.status(404).json({message: "Role not found"});
        }

        res.json(role);
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
});

// DELETE a role
app.delete("/roles/:id", async (req, res) => {
    try {
        await Role.findByIdAndDelete(req.params.id);
        res.json({message: "Role deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//ORIGENES
// Fetch all origenes
app.get("/origenes", async (req, res) => {
    try {
        const origenes = await Origen.find();
        res.json(origenes);
    } catch (e) {
        res.status(500).json({message: "Failed to fetch origenes", error: e.message});
    }
});

// Create a new origen
app.post("/origenes", async (req, res) => {
    try {
        const {name} = req.body;
        const newOrigen = new Origen({name});
        const savedOrigen = await newOrigen.save();
        res.status(201).json(savedOrigen);
    } catch (e) {
        res.status(500).json({message: "Failed to create origen", error: e.message});
    }
});

// Edit an existing origen
app.put("/origenes/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {name} = req.body;
        const updatedOrigen = await Origen.findByIdAndUpdate(id, {name}, {new: true});
        res.json(updatedOrigen);
    } catch (e) {
        res.status(500).json({message: "Failed to edit origen", error: e.message});
    }
});

// Delete an origen
app.delete("/origenes/:id", async (req, res) => {
    try {
        const {id} = req.params;
        await Origen.findByIdAndDelete(id);
        res.status(204).end();
    } catch (e) {
        res.status(500).json({message: "Failed to delete origen", error: e.message});
    }
});

//DESTINOS
app.get("/destinos", async (req, res) => {
    try {
        const destinos = await Destino.find();
        res.status(200).json(destinos);
    } catch (e) {
        res.status(500).json({message: "Error fetching destinos", error: e.message});
    }
});

// Create a new destino
app.post("/destinos", async (req, res) => {
    try {
        const newDestino = new Destino({name: req.body.name});
        const savedDestino = await newDestino.save();
        res.status(201).json(savedDestino);
    } catch (e) {
        res.status(500).json({message: "Error creating destino", error: e.message});
    }
});

// Edit a destino
app.put("/destinos/:id", async (req, res) => {
    try {
        const updatedDestino = await Destino.findByIdAndUpdate(
            req.params.id,
            {name: req.body.name},
            {new: true}
        );
        res.status(200).json(updatedDestino);
    } catch (e) {
        res.status(500).json({message: "Error updating destino", error: e.message});
    }
});

// Delete a destino
app.delete("/destinos/:id", async (req, res) => {
    try {
        await Destino.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Destino deleted successfully"});
    } catch (e) {
        res.status(500).json({message: "Error deleting destino", error: e.message});
    }
});

//OPERADORES
// Get all operadores
app.get("/operadores", async (req, res) => {
    try {
        const operadores = await Operador.find();
        res.status(200).json(operadores);
    } catch (e) {
        res.status(500).json({message: "Error fetching operadores", error: e.message});
    }
});

// Create a new operador
app.post("/operadores", async (req, res) => {
    try {
        const newOperador = new Operador({name: req.body.name});
        const savedOperador = await newOperador.save();
        res.status(201).json(savedOperador);
    } catch (e) {
        res.status(500).json({message: "Error creating operador", error: e.message});
    }
});

// Edit an operador
app.put("/operadores/:id", async (req, res) => {
    try {
        const updatedOperador = await Operador.findByIdAndUpdate(
            req.params.id,
            {name: req.body.name},
            {new: true}
        );
        res.status(200).json(updatedOperador);
    } catch (e) {
        res.status(500).json({message: "Error updating operador", error: e.message});
    }
});

// Delete an operador
app.delete("/operadores/:id", async (req, res) => {
    try {
        await Operador.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Operador deleted successfully"});
    } catch (e) {
        res.status(500).json({message: "Error deleting operador", error: e.message});
    }
});

//start the server
app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
});

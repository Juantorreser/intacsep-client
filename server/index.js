import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Bitacora from "./models/Bitacora.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import Sequence from "./models/Sequence.js";
import Monitoreo from "./models/TipoMonitoreo.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;

//midleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

//Create Custom Middleware to retreive Token Data
app.use((req, res, next) => {
    // Skip requests for login, logout, and refresh_token
    if (
        req.path === "/login" ||
        req.path === "/logout" ||
        req.path === "/refresh_token" ||
        req.path === "/register" ||
        (req.method === "GET" && req.path != "/user")
    ) {
        return next();
    }

    const token = req.cookies.access_token; // Retrieve token after the path check
    req.session = {user: null}; // Initialize session

    // Check if the token exists
    if (!token) {
        console.log("Token is undefined");
        return res.status(401).json({message: "Unauthorized: Token missing"});
    }

    try {
        const data = jwt.verify(token, JWT_SECRET); // Verify the token
        req.session.user = data.user; // Store user data in session
    } catch (e) {
        console.log(e);
        req.session.user = null;
        return res.status(401).json({message: "Unauthorized: Invalid token"}); // Return response on error
    }

    next(); // Proceed to the next middleware
});

//mongoose connection
mongoose.connect(process.env.MONGO_URI);

app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email: email});

        if (!user) {
            throw new Error("User Does Not Exists");
        }

        //compare passwords
        const checkPwd = await bcrypt.compare(password, user.password);
        if (!checkPwd) {
            throw new Error("Incorrect Password");
        }

        //Remove Password from return object
        const publicUser = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
        };
        const JWT_SECRET = process.env.JWT_SECRET;
        const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;

        //Create Access Token
        const accessToken = jwt.sign({user: publicUser}, JWT_SECRET, {
            expiresIn: "15m",
        });

        //create refresh Token
        const refreshToken = jwt.sign({id: user.id, email: user.email}, JWT_SECRET_REFRESH, {
            expiresIn: "5d",
        });

        //save tokens in cookie
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", // Add sameSite option for additional security
            path: "/",
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", // Add sameSite option for additional security
            path: "/",
        });

        user.refesh_token = refreshToken;
        await user.save();

        res.json({user: publicUser});
    } catch (e) {
        console.log(e);
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
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address,
            image: user.image,
            admin: user.admin,
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

// app.get("/user", async (req, res) => {
//     try {
//         const users = await User.find();
//         res.status(200).json(users);
//     } catch (e) {
//         console.log(e);
//     }
// });

// app.post("/user/:id", async (req, res) => {
//     const {id} = req.params;
//     const data = req.body;

//     if (data.password) {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(data.password, saltRounds);
//         await User.updateOne({email: id}, {password: hashedPassword});
//     }

//     try {
//         const userToUpdate = await User.updateOne(
//             {email: id},
//             {
//                 name: data.name,
//                 username: data.username,
//                 phone: data.phone,
//                 address: {
//                     city: data.city,
//                     street: data.street,
//                     unit: data.unit,
//                     zip: data.zipCode,
//                 },
//             }
//         );

//         console.log(userToUpdate);
//         res.status(200).json({message: "User Updated"});
//     } catch (e) {
//         console.log(e);
//         res.json({message: "User NOT Updated"});
//     }
// });

// app.patch("/user/:id", async (req, res) => {
//     const {id} = req.params;
//     const updates = req.body;

//     try {
//         const user = await User.updateOne(
//             {email: id},
//             {
//                 admin: updates.admin,
//             }
//         );
//         if (!user) {
//             return res.status(404).send({error: "User not found"});
//         }
//         res.send(user);
//     } catch (error) {
//         res.status(400).send({error: error.message});
//     }
// });

// app.delete("/user/:id", async (req, res) => {
//     const {id} = req.params;

//     try {
//         const user = await User.deleteOne({email: id});
//         if (!user) {
//             return res.status(404).send({error: "User not found"});
//         }
//         res.send(user);
//     } catch (error) {
//         res.status(400).send({error: error.message});
//     }
// });

app.get("/bitacora_active", async (req, res) => {
    try {
        const activeBits = await Bitacora.find({activa: true});
        res.status(200).json(activeBits);
    } catch (e) {
        console.error("Error fetching active bitácoras:", e);
        res.status(500).json({error: "An error occurred while fetching active bitácoras."});
    }
});

app.get("/bitacora_past", async (req, res) => {
    try {
        const pastBits = await Bitacora.find({activa: false});
        res.status(200).json(pastBits);
    } catch (e) {
        console.error("Error fetching past bitácoras:", e);
        res.status(500).json({error: "An error occurred while fetching past bitácoras."});
    }
});

app.post("/bitacora", async (req, res) => {
    const data = req.body;

    try {
        // Fetch and update the sequence number
        const sequence = await Sequence.findOneAndUpdate(
            {name: "bitacora_id"},
            {$inc: {sequence_value: 1}},
            {new: true, upsert: true} // Create if not exists
        );

        const sequenceNumber = sequence.sequence_value.toString().padStart(6, "0");

        const newItem = new Bitacora({
            bitacora_id: sequenceNumber,
            destino: data.destino,
            origen: data.origen,
            monitoreo: data.monitoreo,
            cliente: data.cliente,
            operador: data.operador,
            telefono: data.telefono,
            placa_tracto: data.placaTracto,
            eco_tracto: data.ecoTracto,
            placa_remolque: data.placaRemolque,
            eco_remolque: data.ecoRemolque,
            id_acceso: data.idAcceso,
            contra_acceso: data.passwordAcceso,
            enlace: data.enlaceRastreo,
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
    const {email, password, firstName, lastName, phone, countryKey, administrator, operator} =
        req.body;

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
            administrator,
            operator,
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

//start the server
app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});

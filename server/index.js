import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

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
            phone: user.phone
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

app.get("/menu_item", async (req, res) => {
    try {
        const menuItems = await Menu_Item.find();
        res.status(200).json(menuItems);
    } catch (e) {
        console.log(e);
    }
});

app.post("/menu_item", async (req, res) => {
    const data = req.body;

    //check if item exists
    const itemExists = await Menu_Item.findOne({name: data.name});
    if (itemExists) {
        await Menu_Item.updateOne(
            {name: itemExists.name},
            {
                price: data.price,
                category: data.category,
                image: data.image,
            }
        );
    } else {
        const newItem = new Menu_Item(data);
        await newItem.save();
    }
});

app.delete("/menu_item", async (req, res) => {
    const data = req.body;

    const itemToDelete = await Menu_Item.deleteOne({name: data.name});

    res.status(200).json({message: "Item Deleted", itemDeleted: itemToDelete});
});

app.get("/order", (req, res) => {});

app.get("/order/:id", (req, res) => {});

app.post("/order", (req, res) => {});

//start the server
app.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}`);
});

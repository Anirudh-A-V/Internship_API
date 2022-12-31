import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";

import User from "./models/user";

const app = express();
app.use(cors({credentials: true, origin: true}));

app.use(session({
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: 'none',
        secure: true,
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to Internship-cell CET API");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`API listening on port ${port}!`);
});

mongoose.set('strictQuery', true);
mongoose.connect(`${process.env.MY_CONNECTION_URL}`
).then(() => {
    console.log("Connected to MongoDB");
}
).catch((err) => {
    console.log("Error connecting to MongoDB", err);
});


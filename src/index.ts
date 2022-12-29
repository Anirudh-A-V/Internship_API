import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";

const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(cookieParser());
app.use(session({
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
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


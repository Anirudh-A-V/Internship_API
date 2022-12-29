import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`API listening on port ${port}!`);
});

mongoose.set('strictQuery', true);
mongoose.connect(`${process.env.MONGO_URI}`, () => {
    console.log("Connected to MongoDB");
});

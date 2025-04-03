import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const coresOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};
app.use(cors(coresOptions));

// Database Connection
connectDB();
//routes
app.post('/', (req, res) => {
    res.send('Hello World');
    console.log("test api")
});
//port
const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log('Server is running on port ', port);
});

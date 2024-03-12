import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { DB_USER, url } from "./utils/UserMongoDb";
import axios from "axios";
import 'dotenv/config';
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from 'fs';
const path = './build/uploads'

fs.access(path, (error) => {

    // To check if given directory  
    // already exists or not 
    if (error) {
        // If current directory does not exist then create it 
        fs.mkdir(path, { recursive: true }, (error) => {
            if (error) {
                console.log(error);
            } else {
                console.log("New Directory created successfully !!");
            }
        });
    } else {
        console.log("Given Directory already exists !!");
    }
});


const app = express();


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50,
});
// Apply rate limiter to all requests
app.use(limiter);

app.use(compression());

app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

app.use(cors());


app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
        },
    }),
);

// Rotas



mongoose
    .connect(
        url, { dbName: "HealthyVibesBD" }
    )
    .then(() => {
        app.listen(process.env.Port, () => {
            console.log("\nConectado com sucesso no Mongo com usuário: ", DB_USER +
                "! \nEscutando na porta:", process.env.Port);
        });
    })
    .catch(err => console.log("PUTZ GRILA!!!\n", err));

axios.get("https://api.ipify.org?format=json").then(response => {
    console.log("\nseu ip é =", response.data);
})
    .catch();




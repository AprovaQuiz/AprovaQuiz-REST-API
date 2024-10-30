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
import { imageRouter } from "./Routes/routerImage";
import { userRouter } from "./Routes/routerUser";
import { passRecoverRouter } from "./Routes/routerPassRecover";
import { calendarRouter } from "./Routes/routerCalendar";
import { historicRouter } from "./Routes/routerHistoric";
import { newsRouter } from "./Routes/routerNews";
import { questionRouter } from "./Routes/routerQuestion";
import { topicRouter } from "./Routes/routerTopic";
import { subjectRouter } from "./Routes/routerSubject";
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
    }
});


const app = express();

app.set('trust proxy', 5)

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
app.use('/images', imageRouter)
app.use('/users', userRouter)
app.use('/passRecovers', passRecoverRouter)
app.use('/calendars', calendarRouter)
app.use('/historics', historicRouter)
app.use('/subjects', subjectRouter)
app.use('/news', newsRouter)
app.use('/questions', questionRouter)
app.use('/topics', topicRouter)


const port = Number(process.env.PORT) || 3000;

mongoose
    .connect(
        url, { dbName: "AprovaQuizBD" }
    )
    .then(() => {
        app.listen(port, '0.0.0.0', () => {
            console.log("\nConectado com sucesso no Mongo com usuário: ", DB_USER +
                "! \nEscutando na porta:", port);
        });
    })
    .catch(err => console.log("PUTZ GRILA!!!\n", err));

axios.get("https://api.ipify.org?format=json").then(response => {
    console.log("\nseu ip é =", response.data);
})
    .catch();




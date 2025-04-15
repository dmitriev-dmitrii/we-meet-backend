import {env} from "./src/constatnts/env.js";
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import {setupRoutes} from "./src/routes/index.js";
import {setupWebSocket} from "./src/web-socket/index.js";
import cors from 'cors'
import cookieParser from "cookie-parser";
import Fingerprint from "express-fingerprint";
import { errorMiddleware } from "./src/midlwares/index.js";
import morgan  from  'morgan';

const {APP_PORT, MODE , APP_NAME } = env

const app = express();
app.use(morgan('dev'));
app.use(cors({
    origin: ['https://dmitriev-dmitrii.github.io','http://localhost:3003'],
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(Fingerprint())

const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ server });

setupRoutes(app);
setupWebSocket(webSocketServer);

app.use( errorMiddleware )
server.listen(APP_PORT, () => {
    console.log(APP_NAME + ' MODE : '+ MODE)
    console.log(`app listen : http://localhost:${APP_PORT}/`);
});

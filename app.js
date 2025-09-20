import {env} from "./src/constatnts/env.js";
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import {setupRoutes} from "./src/routes/index.js";
import {setupWebSocket} from "./src/web-socket/index.js";
import cors from 'cors'
import cookieParser from "cookie-parser";
import Fingerprint from "express-fingerprint";

import morgan  from  'morgan';
import {errorMiddleware} from "./src/midlwares/errorMiddlware.js";

const {BACKEND_APP_PORT, MODE , APP_NAME, IS_DEV_MODE } = env

const app = express();
app.use(morgan('dev'));
app.use(cors({
    origin: ['https://dmitriev-dmitrii.github.io','http://localhost:3003'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(Fingerprint());

const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ server });

setupRoutes(app);
setupWebSocket(webSocketServer);

app.use( errorMiddleware );
server.listen(BACKEND_APP_PORT, () => {
    console.log('IS_DEV_MODE : '+ IS_DEV_MODE)
    console.log(`app listen : http://localhost:${BACKEND_APP_PORT}/`);
});

import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import {setupRoutes} from "./src/routes/index.js";
import {setupWebSocket} from "./src/web-socket/index.js";
import cors from 'cors'
import cookieParser from "cookie-parser";
import Fingerprint from "express-fingerprint";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // todo isDev
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(Fingerprint())

app.use(express.static(path.join(__dirname, './public')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

setupRoutes(app);
setupWebSocket(wss);

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`app listen : http://localhost:${PORT}/`);
});

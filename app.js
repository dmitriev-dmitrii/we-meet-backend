import 'dotenv/config'
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import {setupRoutes} from "./src/routes/index.js";
import {setupWebSocket} from "./src/web-socket/index.js";
import cors from 'cors'
import cookieParser from "cookie-parser";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname, './public')));

setupRoutes(app);
setupWebSocket(wss);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`app listen : http://localhost:${PORT}/`);
});

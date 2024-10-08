import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import {setupRoutes} from "./src/routes/index.js";
import {setupWebSocket} from "./src/web-socket/index.js";


const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, './public')));

app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, './public', 'index.html'));
});

setupRoutes(app);
setupWebSocket(wss);

const PORT = process.env.PORT || 7000;
server.listen(PORT, () => {
    console.log(`app listen :http://localhost:${PORT}/`);
});

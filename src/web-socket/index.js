import { WebSocket } from 'ws';
const MEET_CHANNELS = {
    MEET_CHAT_MESSAGES_CHANNEL: 1 ,
    MEET_USERS_CHANNEL: 2 ,
}

const rooms = new Map();
const  onSocketConnect = (ws , req) => {

    console.log('New client connected');

    ws.on('message', (message) => {
        let data;
        try {
            data = JSON.parse(message);
            console.log('Parsed message:', data);
        } catch (error) {
            console.error('Error parsing message:', error);
            return;
        }

        switch (data.type) {
            case 'join':
                handleJoin(ws, data.roomId);
                break;
            case 'offer':
            case 'answer':
            case 'ice-candidate':
                broadcastToRoom(ws, data.roomId, JSON.stringify(data));
                break;
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        leaveAllRooms(ws);
    });

}


function handleJoin(ws, roomId) {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(ws);
    ws.roomId = roomId;
    console.log(`Client joined room ${roomId}. Total clients in room: ${rooms.get(roomId).size}`);

    if (rooms.get(roomId).size > 1) {
        console.log(`Sending 'user-connected' to clients in room ${roomId}`);
        broadcastToRoom(ws, roomId, JSON.stringify({ type: 'user-connected' }));
    }
}

function broadcastToRoom(sender, roomId, message) {

    console.log(`Broadcasting to room ${roomId}:`, message);

    if (rooms.has(roomId)) {

        rooms.get(roomId).forEach((client) => {
            if (client !== sender && client.readyState === WebSocket.OPEN) {
                console.log('Sending to client');
                client.send(message);
            }
        });
    }
}

function leaveAllRooms(ws) {
    if (ws.roomId && rooms.has(ws.roomId)) {
        rooms.get(ws.roomId).delete(ws);
        console.log(`Client left room ${ws.roomId}. Remaining clients: ${rooms.get(ws.roomId).size}`);
        if (rooms.get(ws.roomId).size === 0) {
            rooms.delete(ws.roomId);
            console.log(`Room ${ws.roomId} is now empty and has been deleted`);
        }
    }
}


export const  setupWebSocket = (ws)=> {
    ws.on('connection', onSocketConnect );
}

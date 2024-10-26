import { WebSocket } from 'ws';
import {MEET_WEB_SOCKET_EVENTS} from "../constatnts/meetWebSocket.js";
import {usersService} from "../services/usersService.js";
import { parse } from 'cookie';
import {meetService} from "../services/meetService.js";
const rooms = new Map();

const  onSocketConnect = (ws , {headers}) => {

    const { userId  , userName } = parse(headers.cookie)

    console.log('New client connected userId:', userName , userId );

    if (userId) {
        usersService.bindWsClientToUser({ userId, userName, ws })
    }

    ws.on('message', (payload) => {
        let data;
        try {
            data = JSON.parse(payload);
            console.log('Parsed message:', data);

        } catch (error) {
            console.error('Error parsing message:', error);
            return;
        }

        const { type } = data

        switch (type) {
            case MEET_WEB_SOCKET_EVENTS.JOIN_MEET:
                joinMeetHandle(data);
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


async function   joinMeetHandle( {  userName, meetId , userId }   ) {

  const meet =  await meetService.findMeetById(meetId)
    console.log('joinMeetHandle', meet)

  if ( !meet ) {
     return
  }

  const message = {
      type: MEET_WEB_SOCKET_EVENTS.USER_CONNECTED,
      userId,
      userName
  }

  meet.appendUserToMeet({userId})
  await  meet.broadcastToMeetUsers({userId , message})
    // usersService.bindWsClientToUser({ userId, ws })

    // if (!rooms.has(roomId)) {
    //     rooms.set(roomId, new Set());
    // }
    // rooms.get(roomId).add(ws);
    // ws.roomId = roomId;

    // console.log(`Client joined room ${roomId}. Total clients in room: ${rooms.get(roomId).size}`);

    // if (rooms.get(roomId).size > 1) {
    //     console.log(`Sending 'user-connected' to clients in room ${roomId}`);
    //     broadcastToRoom(ws, roomId, JSON.stringify({ type: 'user-connected' }));
    // }
}

function broadcastToRoom({sender, roomId, message}) {

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

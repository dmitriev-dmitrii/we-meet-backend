import { WebSocket } from 'ws';
import {MEET_WEB_SOCKET_EVENTS} from "../constatnts/meetWebSocket.js";
import {usersService} from "../services/usersService.js";
import { parse } from 'cookie';
import {meetService} from "../services/meetService.js";

// const rooms = new Map();

const  onSocketConnect = (ws , {headers} ) => {

    const { cookie = '' } =  headers

    const { userId  , userName } = parse( cookie )

    console.log('New client connected userId:', userName , userId );

    ws.on('message', (payload) => {

        let data;
        try {
            data = JSON.parse(payload);
            // console.log('Parsed message:', data);

            data.ws = ws
        } catch (error) {
            console.error('Error parsing message:', error);
            return;
        }

        const { type } = data

        switch (type) {
            case MEET_WEB_SOCKET_EVENTS.USER_ENTER_MEET:
                joinMeetHandle(data);
                break;
            case MEET_WEB_SOCKET_EVENTS.CHAT_MESSAGE:
                meetChatMessageHandle(data);
                break;

            // case 'offer':
            // case 'answer':
            // case 'ice-candidate':
            //     broadcastToRoom(ws, data.roomId, JSON.stringify(data));
            //     break;
        }
    });

    ws.on('close', (code, reason) => {

        const user = usersService.findUserByWs(ws);


        console.log('Client disconnected:', {
            userId: user?.userId,
            userName: user?.userName,
            code,
            reason
        });


    });

}


async function meetChatMessageHandle({ userName, meetId, userId, text = '' }) {
    const meet = await meetService.findMeetById(meetId)

    if (!meet || !text) {
        return
    }

    const message = {
        type: MEET_WEB_SOCKET_EVENTS.CHAT_MESSAGE,
        userName,
        text
    }

    await meet.broadcastToMeetUsers({
        message 
    })
}
async function   joinMeetHandle( {  userName, meetId , userId='' ,  ws }   ) {

   if (!userId) {
       console.error(' joinMeetHandle err  userId is',userId )
        return
   }

   const meet = await meetService.findMeetById(meetId)

   if (!meet) {
      console.log('joinMeetHandle warn meet is', meet)
      return
   }

    await usersService.bindWsClientToUser({ userId, userName, ws })

   console.log('AppendUserToMeet before:', meet.meetUsers)
   const result = await meet.appendUserToMeet({userId})
   console.log('AppendUserToMeet result:', result)

}

// function broadcastToRoom({sender, roomId, message}) {
//
//     console.log(`Broadcasting to room ${roomId}:`, message);
//
//     if (rooms.has(roomId)) {
//
//         rooms.get(roomId).forEach((client) => {
//             if (client !== sender && client.readyState === WebSocket.OPEN) {
//                 console.log('Sending to client');
//                 client.send(message);
//             }
//         });
//     }
// }
//
// function leaveAllRooms(ws) {
//     if (ws.roomId && rooms.has(ws.roomId)) {
//         rooms.get(ws.roomId).delete(ws);
//         console.log(`Client left room ${ws.roomId}. Remaining clients: ${rooms.get(ws.roomId).size}`);
//         if (rooms.get(ws.roomId).size === 0) {
//             rooms.delete(ws.roomId);
//             console.log(`Room ${ws.roomId} is now empty and has been deleted`);
//         }
//     }
// }
//

export const  setupWebSocket = (ws)=> {
    ws.on('connection', onSocketConnect );
}

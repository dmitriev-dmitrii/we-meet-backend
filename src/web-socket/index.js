import { WebSocket } from 'ws';
import {MEET_WEB_SOCKET_EVENTS} from "../constatnts/meetWebSocket.js";
import {usersService} from "../services/users/usersService.js";
import {meetService} from "../services/meet/meetService.js";




const  onSocketConnect = (ws , req ) => {


    ws.on('message', (payload) => {

        let data;
        try {
            data = JSON.parse(payload);
            // console.log('Parsed message:', data);

            data.ws = ws
            data.createdAt = Date.now()

        } catch (error) {
            console.error('Error parsing message:', error);
            return;
        }

        const { type } = data

        switch (type) {
            case  MEET_WEB_SOCKET_EVENTS.USER_WEB_SOCKET_AUTH:
                userWebSocketAuth(data);
                break;
            // case MEET_WEB_SOCKET_EVENTS.USER_JOIN_MEET:
            //     userJoinMeetHandle(data);
            //     break;
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

    ws.on('close' ,  async ( code, reason ) => {

        const user = await usersService.findUserByWs(ws)

        if (!user) {
            return
        }

        const {  userId ,  meetId } = user

        await  usersService.disconnectUser(userId);

        const meet = await meetService.findMeetById(  meetId  )

        if (meet) {
            await  meet.removeUserFromMeet({ userId })
        }

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
        message ,
    })
}
// async function   userJoinMeetHandle( {  userName, meetId , userId='' ,  ws }   ) {
//
//     const user = await usersService.findUserById(userId)
//
//    if (!user) {
//        console.error(' joinMeetHandle err user is',user)
//         return
//    }
//
//    const meet = await meetService.findMeetById(meetId)
//
//    if (!meet) {
//       console.log('joinMeetHandle warn meet is', meet)
//       return
//    }
//
//     await meet.appendUserToMeet(user)
// }

async function  userWebSocketAuth ( { userFingerprint = ''  ,  ws } ) {

    const user = await  usersService.findUserByFingerprint(userFingerprint)

    if (!user) {
        console.log('err userWebSocketAuth user is no auth ')
        return
    }

    const { userId , userName } = user

    await usersService.bindWsClientToUser({ userId, ws })

    // const meet = await meetService.findMeetById(meetId) ?? await meetService.createMeet({ userId , userName })

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

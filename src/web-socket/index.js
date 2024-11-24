import { WebSocket } from 'ws';

import {MEET_WEB_SOCKET_EVENTS} from "../constatnts/meetWebSocket.js";
import {usersService} from "../services/users/usersService.js";
import {meetService} from "../services/meet/meetService.js";
import { parse } from 'cookie';


const  onSocketConnect = async  (ws , {headers} ) => {

    const {cookie = ''} = headers
    const { userId } = parse(cookie)

    await userWebSocketAuth({userId,ws})

    ws.on('message',async (payload) => {

        let data;
        try {
            data = JSON.parse(payload);
            // console.log('Parsed message:', data);
            data.createdAt = Date.now()
            data.ws = ws
        } catch (error) {
            console.error('Error parsing message:', error);
            return;
        }

        const { type } = data

        switch (type) {
            case MEET_WEB_SOCKET_EVENTS.CHAT_MESSAGE:
           await     meetChatMessageHandle(data);
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

        const meet = await meetService.findMeetById(  meetId  )

        if (meet) {
            await  meet.removeUserFromMeet({ userId })
        }

        await  usersService.disconnectUser(userId);
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

async function  userWebSocketAuth ( { userId  ,  ws } ) {

    const user = await  usersService.findUserById(userId)

    if (!user) {
        console.log(`userWebSocketAuth cant find user by id ${userId} : => close ws`)
        ws.close()
        return
    }

    await usersService.bindWsClientToUser({ userId, ws })
}


export const  setupWebSocket = (webSocketServer)=> {
    webSocketServer.on('connection', onSocketConnect );
}

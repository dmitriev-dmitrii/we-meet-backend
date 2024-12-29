import { WebSocket } from 'ws';

import {MEET_WEB_SOCKET_EVENTS} from "../constatnts/meetWebSocket.js";
import {usersService} from "../services/users/usersService.js";
import {meetService} from "../services/meet/meetService.js";

const  onSocketConnect = async  (ws , { url } ) => {

    const params = new URLSearchParams( url )

    const meetId = params.get('meetId')
    const userId = params.get('userId')


    const meet =  await meetService.findMeetById(meetId)

    if (!meet) {

    }

    await userWebSocketAuth({ userId, meetId , ws } )

    ws.on('message',async (payload) => {

        let data;
        try {
            data = JSON.parse(payload);
            console.log('Parsed message:', data.type);
            data.createdAt = Date.now()
            // data.ws = ws

        } catch (error) {
            console.error('Error parsing message:', error);
            return;
        }

        const { type } = data

        switch (type) {
            case MEET_WEB_SOCKET_EVENTS.CHAT_MESSAGE:
           await  meetChatMessageHandle(data);
                break;

       // case MEET_WEB_SOCKET_EVENTS.RTC_OFFER:
       //          await  onRtcOffer(data);
       //        break;
       //
       //  case MEET_WEB_SOCKET_EVENTS.RTC_ANSWER:
       //          await  onRtcAnswer(data);
       //         break;
       //
       //   case MEET_WEB_SOCKET_EVENTS.RTC_ICE_CANDIDATE:
       //          await  onRtcIceCandidate(data);
       //       break;

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

        await  usersService.disconnectUser({userId});
    });

}


async function onRtcOffer(payload) {

    const { meetId, userId } = payload

    const meet = await meetService.findMeetById(meetId)

    if (!meet) {
        return
    }

    await meet.broadcastToMeetUsers( payload , userId )
}


async function onRtcAnswer(payload) {

    const {meetId, userId} = payload

    const meet = await meetService.findMeetById(meetId)

    if (!meet) {
        return
    }

    await meet.wispToMeetUser( payload, meet.meetOwnerId  )
}

async function onRtcIceCandidate(payload) {
    const {meetId, userId} = payload

    const meet = await meetService.findMeetById(meetId)

    if (!meet) {
       return
    }


    await meet.broadcastToMeetUsers( payload , userId)

}

async function meetChatMessageHandle(payload) {

    const { meetId, userId, data } = payload

    const meet = await meetService.findMeetById(meetId)

    const user = await  usersService.findUserById(userId)

    const { text } = data

    if (!meet || !text || !user) {
        return
    }

    const { userName } = user

    await meet.broadcastToMeetUsers({...payload , userName })
}

async function  userWebSocketAuth ( { userId  ,  ws } ) {

    const user = await  usersService.findUserById(userId)

    if (!user) {
        console.log(`userWebSocketAuth cant find user by id ${userId} : => close ws`)
        ws.close(3000)
        return
    }

    await usersService.bindWsClientToUser({ userId, ws })
}


export const  setupWebSocket = (webSocketServer)=> {
    webSocketServer.on('connection', onSocketConnect );
}

import {usersService} from "./usersService.js";
import {WebSocket} from "ws";
import {MEET_WEB_SOCKET_EVENTS} from "../constatnts/meetWebSocket.js";

 const meetStorage = new Map()

 class Meet {
     meetId = '';
     meetUsers = [];
     meetChatMessages = [];
     meetOwner = '';

         constructor({ meetId, meetOwner }) {
         this.meetId = meetId
         this.meetOwner = meetOwner
     }

   async appendUserToMeet({ userId='' }) {

    if ( userId && !this.meetUsers.includes(userId) ) {
        this.meetUsers.push(userId)
    }

    return this.meetUsers
   }

    async broadcastToMeetUsers({ senderUserId = '', message = {} }) {
        const payload = JSON.stringify(message)
        const { type } = message

        if (type === MEET_WEB_SOCKET_EVENTS.CHAT_MESSAGE) {
            message.sentAt = Date.now()
            this.meetChatMessages.push(message)
        }


        for (const meetUserId of this.meetUsers) {

            const user = await usersService.findUserById(meetUserId);

            const  isRepeatToSender =  meetUserId !== senderUserId

            if (isRepeatToSender && user?.ws?.readyState === WebSocket.OPEN) {
                try {
                    user.ws.send(payload);
                    console.log('Message sent successfully to:', meetUserId);
                } catch (error) {
                    console.error('Failed to send message:', error);
                }
            }
        }
    }
 }

export const meetService = {

    createMeet : async (payload)=> {

        const meetId = String( Math.floor(Math.random() * 1000))

        const { userName, userId } = payload

        const meet = new Meet ({
            meetId,
            meetOwner: userId,
        })

        meetStorage.set( meetId , meet )

        return   meetStorage.get(meetId)
    },

    findMeetById : async (id)=> {

       return  meetStorage.get(id)
    },



}

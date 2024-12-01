import {usersService} from "../users/usersService.js";
import {WebSocket} from "ws";
import {MEET_WEB_SOCKET_EVENTS} from "../../constatnts/meetWebSocket.js";


const  saveChatMessagesTypes =  [
    MEET_WEB_SOCKET_EVENTS.CHAT_MESSAGE ,
    MEET_WEB_SOCKET_EVENTS.USER_JOIN_MEET ,
    MEET_WEB_SOCKET_EVENTS.USER_LEAVE_MEET
]

 const meetStorage = new Map()


 class Meet {
     meetId = '';
     meetUsers = new Map();
     meetChatMessages = [];
     meetOwnerId = '';
     rtcOffer = ''

         constructor({ meetId, meetOwnerId , rtcOffer }) {
         this.meetId = meetId
         this.meetOwnerId = meetOwnerId
         this.rtcOffer = rtcOffer
     }

   async appendUserToMeet( user ) {

    const { userId, userName, userIsOnline } = user

    if(!userId || !userName || !userIsOnline ) {
        throw new Error (`'appendUserToMeet err','userId:', ${userId} ,'userName',${userName} ,'userIsOnline',${userIsOnline}` )
    }

    this.meetUsers.set( userId , user )

    const message = {
           type: MEET_WEB_SOCKET_EVENTS.USER_JOIN_MEET,
           userName,
           userId,
           data: {
               text: `${userName} USER_JOIN_MEET`
           }
    }

    await this.broadcastToMeetUsers({ message } )

   }

   async removeUserFromMeet({userId}) {

     const user =    this.meetUsers.get(userId)

        if (! user ) {
             return
        }

       const {userName} = user

       const message = {
             type: MEET_WEB_SOCKET_EVENTS.USER_LEAVE_MEET,
             userName,
             userId,
             data: { text: `${userName} USER_LEAVE_MEET`}
       }

       await this.broadcastToMeetUsers({ senderUserId:userId, message } )

   }

    async broadcastToMeetUsers({ senderUserId = '', message = {} }) {

        const { type , userName } = message
        message.createdAt = Date.now()

        const payload = JSON.stringify(message)

        if (saveChatMessagesTypes.includes( type )) {
            this.meetChatMessages.push(message)
        }

        for (const user of this.meetUsers.values()) {



            const  isRepeatToSender =  user.userId !== senderUserId
            //если нужно исключить отправителя из отправки, передать userId в поле senderUserId

            if ( !user.userIsOnline && isRepeatToSender ) {
                console.warn(` ${user.userName} Is not Online`, user.userIsOnline  ,'message', message );
            }

            if ( isRepeatToSender && user.userIsOnline ) {
                try {
                     user.ws.send(payload);
                } catch (error) {
                    console.error('Failed to send message: to user' , user.name , error );
                }
            }

        }
    }
 }

export const meetService = {

    createMeet : async (payload)=> {

        // const meetId = String( Math.floor(Math.random() * 1000))
        const meetId = String( 123)

        const { userId, rtcOffer } = payload

        const meet = new Meet ({
            meetId,
            meetOwnerId: userId,
            rtcOffer,
        })

        meetStorage.set( meetId , meet )

        return   meetStorage.get(meetId)
    },

    findMeetById : async (id)=> {

       return  meetStorage.get(id)
    },



}

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

         constructor({ meetId, meetOwnerId }) {
         this.meetId = meetId
         this.meetOwnerId = meetOwnerId
     }

   async appendUserToMeet( user ) {

    const { userId, userName, userIsOnline } = user

    if(!userId || !userName || !userIsOnline ) {
        console.warn( 'appendUserToMeet err','userId:', userId ,'userName',userName ,'userIsOnline',userIsOnline )
        return
    }

    this.meetUsers.set( userId , user )

    const message = {
           type: MEET_WEB_SOCKET_EVENTS.USER_JOIN_MEET,
           userName,
           userId,
           text: ` ${userName} USER_JOIN_MEET`
    }

    await this.broadcastToMeetUsers({ message } )

   }

   async removeUserFromMeet({userId}) {

       const {userName} =  this.meetUsers.get(userId)

       const message = {
             type: MEET_WEB_SOCKET_EVENTS.USER_LEAVE_MEET,
             userName,
             userId,
             text: `${userName} USER_LEAVE_MEET`
       }

       await this.broadcastToMeetUsers({ senderUserId:userId, message } )

       return this.meetUsers
   }

    async broadcastToMeetUsers({ senderUserId = '', message = {} }) {

        const { type , userName } = message
        message.createdAt = Date.now()

        const payload = JSON.stringify(message)

        if (saveChatMessagesTypes.includes( type )) {
            this.meetChatMessages.push(message)
        }


        for (const user of this.meetUsers.values()) {

            if ( !user.userIsOnline ) {
                console.warn(` ${user.name} userIsOnline is ` , user.userIsOnline );
            }

            const  isRepeatToSender =  user.userId !== senderUserId
            //если нужно исключить отправителя из отправки, передать userId в поле senderUserId

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

        const { userId } = payload

        const meet = new Meet ({
            meetId,
            meetOwnerId: userId,
        })

        meetStorage.set( meetId , meet )

        return   meetStorage.get(meetId)
    },

    findMeetById : async (id)=> {

       return  meetStorage.get(id)
    },



}

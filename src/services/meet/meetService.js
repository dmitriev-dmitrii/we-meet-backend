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

         constructor({ meetId, meetOwnerId  }) {
         this.meetId = meetId
         this.meetOwnerId = meetOwnerId
     }

   async appendUserToMeet( user ) {

    const { userId, userName, userIsOnline } = user

    if(!userId || !userName || !userIsOnline ) {
        throw new Error (`'appendUserToMeet err','userId:', ${userId} ,'userName',${userName} ,'userIsOnline',${userIsOnline}` )
    }

    this.meetUsers.set( userId , user )

    const payload = {
           type: MEET_WEB_SOCKET_EVENTS.USER_JOIN_MEET,
           userName,
           userId,
           data: {
               text: `${userName} USER_JOIN_MEET`
           }
    }

    await this.broadcastToMeetUsers( payload )

   }

   async removeUserFromMeet({userId}) {

     const user =    this.meetUsers.get(userId)

        if (! user ) {
             return
        }

       const {userName} = user

       const payload = {
             type: MEET_WEB_SOCKET_EVENTS.USER_LEAVE_MEET,
             userName,
             userId,
             data: { text: `${userName} USER_LEAVE_MEET`}
       }

       await this.broadcastToMeetUsers( payload , userId )

   }

    async broadcastToMeetUsers(payload , senderUserId = '') {



        const { type , userName , createdAt } = payload


        if (!createdAt) {
            payload.createdAt = Date.now()
        }


        const msg = JSON.stringify(payload)

        if (saveChatMessagesTypes.includes( type )) {
            this.meetChatMessages.push(payload)
        }

        for (const user of this.meetUsers.values()) {



            const  isRepeatToSender =  user.userId !== senderUserId
            //если нужно исключить отправителя из отправки, передать userId в поле senderUserId

            if ( !user.userIsOnline && isRepeatToSender ) {
                console.warn(` ${user.userName} Is not Online`, user.userIsOnline  ,'message', payload);
            }

            if ( isRepeatToSender && user.userIsOnline ) {
                try {
                     user.ws.send(msg);
                } catch (error) {
                    console.error('Failed to send message: to user' , user.name , error );
                }
            }

        }
    }



     async wispToMeetUser(payload , wispUserId = '') {

         const { type , userName , createdAt } = payload

         if ( !wispUserId ) {
             console.warn(`wispUserId  is  ${wispUserId} `);
             return
         }

         if (!createdAt) {
             payload.createdAt = Date.now()
         }

         const msg = JSON.stringify(payload)


         for (const user of this.meetUsers.values()) {

             if (  user.userIsOnline && wispUserId === user.userId ) {
                 try {
                     user.ws.send(msg);
                 } catch (error) {
                     console.error('Failed to send message: to user' , user.name , error );
                 }

                 break
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

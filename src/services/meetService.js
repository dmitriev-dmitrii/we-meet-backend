import {usersService} from "./usersService.js";
import {WebSocket} from "ws";


 const meetStorage = new Map()

 class Meet {
     meetId = '';
     meetUsers = [];
     meetOwner = '';

         constructor({ meetId, meetOwner }) {
         this.meetId = meetId
         this.meetOwner = meetOwner

     }

    appendUserToMeet( { userId } ) {
         if (userId) {
             this.meetUsers.push(userId)
             return
         }
        console.warn('appendUserToMeet userId is ' , userId )
    }
    async broadcastToMeetUsers( { senderUserId = '' , message= {} } ) {

       if (!this.meetUsers.length > 1) {
             return
       }

       const payload = JSON.stringify(message)

       for (  const meetUserId of  this.meetUsers ) {

       const  { ws }  = await  usersService.findUserById(meetUserId );

            if (meetUserId !== senderUserId && ws?.readyState === WebSocket.OPEN) {
                ws.send(payload);
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
        meet.meetUsers.push(userId)
        meetStorage.set( meetId , meet )

        return  meet
    },

    findMeetById : async (id)=> {

       return  meetStorage.get(id)
    },



}
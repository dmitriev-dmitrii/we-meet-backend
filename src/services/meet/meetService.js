import {WebSocket} from "ws";
import {Meet} from "./endtites/Meet.js";
import {User} from "./endtites/User.js";
const meetStorage = new Map();

export const meetService = {

    createMeet : async (payload)=> {

        const meet = new Meet ( payload )

        meetStorage.set( meet.meetId , meet )

        return   meetStorage.get( meet.meetId )
    },

    removeMeet :async (meetId)=> {
        meetStorage.delete(meetId)
    },

    findMeetById : async (meetId)=> {

       return  meetStorage.get(meetId)
    },

}


import {User} from "./User.js";
export  class Meet {
    meetId = '';
    meetUsers = new Map();
    meetOwnerId = '';
    isPrivateMeet =  false;
    password = ''
    constructor( { password='' } ) {
        this.meetId = 'hui' //todo generate id
        this.isPrivateMeet = Boolean(password)
        this.password = password
    }

    appendUserToMeet = async (newUserPayload) => {

        const user = new User(newUserPayload)

        if (!this.meetUsers.size) {
            this.meetOwnerId = user.userId
        }

        this.meetUsers.set(user.userId, user)
        return this.meetUsers.get(user.userId)
    }

    removeUserFromMeet = (userId)=> {
      return   this.meetUsers.delete(userId)
    }

}
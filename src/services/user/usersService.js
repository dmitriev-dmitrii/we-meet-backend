
import {User} from "./endtites/User.js";
const usersStorage = new Map();

export const usersService = {

    createUser : async (payload)=> {

        const user = new User ( payload )

        usersStorage.set( user.userId ,user )

        return   usersStorage.get(  user.userId  )
    },

    findUserById : async  (userId)=> {
      return   usersStorage.get( userId )
    },

    deleteUserById : async  (userId)=> {
        return   usersStorage.delete( userId )
    }

}

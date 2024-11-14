import WebSocket from 'ws';

const usersStorage = new Map()
class User {
    userId = ''
    userName = ''
    meetId = ''
    ws = {}
    constructor( { userName= '', userFingerprint='' } ) {

        this.userName = userName.trim().toLowerCase()
        this.userId = userFingerprint + userName + Date.now()
    }

    setMeetId( meetId ) {
        this.meetId = meetId
    }

    get userIsOnline (){
        return Boolean(this.ws?.readyState === WebSocket.OPEN)
    }
}

export const usersService = {

    saveUser : async ({ userName, userFingerprint })=> {

        const user = new User({ userName  , userFingerprint })

        usersStorage.set(user.userId , user);

        return usersStorage.get(user.userId)
    },


    bindWsClientToUser: ({ userId, ws }) => {

       const user  = usersStorage.get(userId)
        user.ws = ws
        usersStorage.set(userId, user);

        return  usersStorage.get(userId);
    },

    findUserById : async (userId)=> {
        return usersStorage.get(userId);
    },

    findUserByWs: async (ws) => {

        for (const [userId, user] of usersStorage.entries()) {
            if (user.ws === ws) {
                return user;
            }
        }
        return null;

    },

    disconnectUser: async (  userId ) => {

        const {ws} = usersStorage.get(userId)

        ws.close()

        return   usersStorage.delete(userId)

    }

}

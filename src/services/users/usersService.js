import WebSocket from 'ws';

const usersStorage = new Map()
class User {
    userId = '' //TODO удалить все userId
    userName = ''
    userFingerprint = ''
    meetId = ''
    ws = {}
    constructor( { userName= '', userFingerprint='' } ) {
        // this.userId   = String( Math.floor(Math.random() * 10000));
        this.userName = userName.trim().toLowerCase()
        this.userFingerprint = userFingerprint
        this.userId   =  userFingerprint
    }

    setMeetId( meetId ) {
        this.meetId = meetId
    }

    get userIsOnline (){
        return Boolean(this.ws?.readyState === WebSocket.OPEN && this.userFingerprint)
    }
}

export const usersService = {

    saveUser : async ({ userName, userFingerprint })=> {

        const user = new User({ userName  , userFingerprint })

        usersStorage.set(user.userId , user);

        return user
    },

    findUserById : async (userId)=> {
        return usersStorage.get(userId);
    },

    bindWsClientToUser: ({ userId, ws }) => {

       const user  = usersStorage.get(userId)
        user.ws = ws
        usersStorage.set(userId, user);

        return  usersStorage.get(userId);
    },

    findUserByFingerprint: (userFingerprint='') => {

    if (userFingerprint) {
        for ( const [userId, user] of usersStorage.entries() ) {

            if (user.userFingerprint === userFingerprint) {

                return user;
            }
        }
    }

      return null;
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

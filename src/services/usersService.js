import WebSocket from 'ws';

const usersStorage = new Map()

class User {
    userId = ''
    userName = ''
    ws = undefined
    constructor({userName= '', userId , ws}) {
        this.userId   = userId
        this.userName = userName.toLowerCase()
        this.ws = ws
    }
}

export const usersService = {


    findUserById : async (userId)=> {
        return usersStorage.get(userId);
    },

    bindWsClientToUser: ({ userId, userName, ws }) => {

        usersStorage.set(userId, new User({ userId, userName, ws }));

        return  usersStorage.get(userId);
    },

    findUserByWs: (ws) => {
        for (const [userId, user] of usersStorage.entries()) {
            if (user.ws === ws) {
                return user;
            }
        }
        return null;
    }

}


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

        return  usersStorage.get(userId)
    },

    bindWsClientToUser : ({ userId , ws })=> {

        const user = usersStorage.has(userId) ? usersStorage.get(userId) : usersStorage.set(userId , new User({ userId , ws }))

        if (user && ws) {
            user.ws = ws
            usersStorage.set(userId , user)
            return
        }

        console.log(' bindWsClientToUser err' , )
    }

}
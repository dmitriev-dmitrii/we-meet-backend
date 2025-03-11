

export  class Meet {
    meetId = '';
    ownerUserId = ''
    meetUsers = new Map();

    isPrivateMeet =  false;
    password = ''
    constructor( { password='' , userId='' } ) {
        // this.meetId = String(Date.now()) //todo generate id
        this.meetId = '123'
        this.isPrivateMeet = Boolean(password)
        this.password = password
        this.ownerUserId = userId
    }

    // appendUserToMeet = async (newUserPayload) => {
    //
    //     const user = new User(newUserPayload)
    //
    //     this.meetUsers.set(user.userId, user)
    //     return this.meetUsers.get(user.userId)
    // }

    // removeUserFromMeet = (userId)=> {
    //   return   this.meetUsers.delete(userId)
    // }

}
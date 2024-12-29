export class MeetDto {
    meetId  = ''
    meetOwnerId = ''

    meetUsers = []
    meetChatMessages = []

    constructor({ meetUsers , meetId , meetChatMessages , meetOwnerId }) {
        this.meetId = meetId
        this.meetOwnerId = meetOwnerId
        this.meetChatMessages =  meetChatMessages
        this.meetUsers =  Array.from(meetUsers.values()).map(({userId})=>userId);
    }
}
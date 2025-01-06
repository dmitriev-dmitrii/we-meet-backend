export class MeetDto {
    meetId  = ''
    meetOwnerId = ''
    meetUsers = []


    constructor({ meetUsers , meetId ,  meetOwnerId }) {
        this.meetId = meetId
        this.meetOwnerId = meetOwnerId
        this.meetUsers =  Array.from(meetUsers.values());
    }
}
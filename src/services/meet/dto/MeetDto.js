export class MeetDto {
    meetId  = ''
    meetUsers = []
    ownerUserId = ''

    constructor({ meetUsers , meetId , ownerUserId }) {
        this.meetId = meetId
        // this.meetUsers =  Array.from(meetUsers.values());
        this.ownerUserId = ownerUserId
    }
}
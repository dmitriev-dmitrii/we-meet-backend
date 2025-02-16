export class MeetDto {
    meetId  = ''
    meetUsers = []


    constructor({ meetUsers , meetId }) {
        this.meetId = meetId
        this.meetUsers =  Array.from(meetUsers.values());
    }
}
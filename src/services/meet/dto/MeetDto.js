export class MeetDto {
    meetId  = ''
    // meetUsers = []
    ownerUserId = ''
    isPrivateMeet = false

    constructor({ meetUsers , meetId , ownerUserId , isPrivateMeet}) {
        this.meetId = meetId
        // this.meetUsers =  Array.from(meetUsers.values());
        this.ownerUserId = ownerUserId
        this.isPrivateMeet = isPrivateMeet
        // this.meetUsers = meetUsers
    }
}
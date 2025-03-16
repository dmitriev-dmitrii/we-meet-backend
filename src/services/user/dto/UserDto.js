export class UserDto {
    userId = ''
    userName = ''

    constructor({userId = '' , userName = '' }) {
        this.userName = userName
        this.userId = userId
    }
}
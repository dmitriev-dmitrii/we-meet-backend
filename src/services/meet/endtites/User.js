
export class User {
    userId = ''
    userName = ''
    useragent = {}
    constructor( { userName= '', fingerprint= {}   } ) {
        // FingerprintResult
        const { components , hash } = fingerprint

        this.useragent = components

        this.userName = String(userName).trim().toLowerCase()
        this.userId = `${this.userName}-${hash}`;
    }
}

export class User {
    userId = ''
    userName = ''

    constructor( { userName= '', fingerprint= {}   } ) {

        const { components , hash } = fingerprint

        const {useragent} = components

        this.userName = userName ?  userName : hash //todo random animals name

        this.userId = `[${useragent.browser.family}-${useragent.browser.version}][${useragent.os.family}][${hash}]`.trim().toLowerCase();
    }
}
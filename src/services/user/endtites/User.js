
export class User {
    userId = ''
    userName = ''

    constructor( { userName= '', fingerprint= {}   } ) {

        const { components , hash } = fingerprint

        const {useragent} = components

        this.userName = userName ?  userName : hash //todo random animals name
        this.userAccentColor = '' //todo uniq accent color

        this.userId = `[${useragent.os.family}][${useragent.browser.family}-${useragent.browser.version}][${hash}]`.trim().toLowerCase();
    }
}
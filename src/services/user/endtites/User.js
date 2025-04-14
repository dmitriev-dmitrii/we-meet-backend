export class User {
    userId = ''
    userName = ''
    isMeetOwner = false
    meetId = ''

    constructor({userName = '', fingerprint = {}}) {

        const {components, hash} = fingerprint

        const {useragent} = components

        this.userName = userName ? userName : useragent.os.family + useragent.browser.family
        this.userAccentColor = '' //todo uniq accent color

        this.userId = `[${useragent.os.family}][${useragent.browser.family}-${useragent.browser.version}][${hash}]`.trim().toLowerCase().replace(/ /g, '-');
    }

}
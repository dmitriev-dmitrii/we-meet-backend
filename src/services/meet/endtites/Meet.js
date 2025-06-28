import {env} from "../../../constatnts/env.js";

const { IS_DEV_MODE } = env

export  class Meet {
    meetId = '';
    ownerUserId = ''
    isPrivateMeet =  false;
    password = ''
    constructor( { password='' , userId='' } ) {

        this.meetId = String(Date.now())

        if (IS_DEV_MODE) {
            this.meetId = '123'
        }

        this.isPrivateMeet = Boolean(password)
        this.password = password
        this.ownerUserId = userId
    }

}
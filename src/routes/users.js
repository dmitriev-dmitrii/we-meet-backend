import {Router} from "express";
import {usersService} from "../services/user/usersService.js";
import {env} from "../constatnts/env.js";
import freeIce from "freeice";
import {UserDto} from "../services/user/dto/UserDto.js";

const {METERED_API_KEY,
    IS_DEV_MODE,
    TURN_USERNAME,
    TURN_PASSWORD,
    DOMAIN,
} = env

const infraIceServers = [
    {
        urls: [
            `stun:${DOMAIN}:3478`,
            `stun:${DOMAIN}:3478`
        ]
    },
    {
        urls: [
            `turn:${DOMAIN}:3478?transport=udp`,
            `turn:${DOMAIN}:3478?transport=tcp`,
            `turns:${DOMAIN}:5349?transport=tcp`
        ],
        username: TURN_USERNAME,
        credential: TURN_PASSWORD
    }
];
export const usersRouter = Router()

usersRouter.post('/auth', async ({body = {}, fingerprint}, res) => {

    const {userName = ''} = body

    const user = await usersService.createUser({fingerprint, userName})

    res.send(new UserDto(user))
})

usersRouter.get('/ice-servers', async (req, res) => {

    if (req.query['coturn'] === 'true') {
        res.send(infraIceServers)
        return
    }

    const freeIces =  freeIce()

    if (IS_DEV_MODE) {
        res.send(freeIces)
      return
    }


    try {
        const metredApiRes = await fetch(`https://we_meet.metered.live/api/v1/turn/credentials?apiKey=${METERED_API_KEY}`)

        const metredinfraIceServers = await metredApiRes.json();
        res.send([...metredinfraIceServers, ...freeIces])
    } catch (e) {
        res.send(freeIce())
    }

})


import {Router} from "express";
import {usersService} from "../services/user/usersService.js";
import {env} from "../constatnts/env.js";
import freeIce from "freeice";
import {UserDto} from "../services/user/dto/UserDto.js";

const {METERED_API_KEY,
    IS_DEV_MODE,
    TURN_USERNAME,
    TURN_PASSWORD,
    TURN_STATIC_AUTH_SECRET,
    TURN_REALM,
    TURN_PORT_TCP,
    TURN_PUBLIC_IP,
    TURN_PORT_UDP,
    TURN_PORT_TLS,
} = env

const GOOGLE_ICES = [
    {urls: "stun:stun.l.google.com:19302"}, // Обязательно для Firefox
    {urls: "stun:stun1.l.google.com:19302"},
    {urls: "stun:stun2.l.google.com:19302"},
    {urls: "stun:stun3.l.google.com:19302"}
]

const iceServers = [
    {
        urls: [
            `stun:${TURN_PUBLIC_IP}:${TURN_PORT_UDP}`,
            `stun:${TURN_PUBLIC_IP}:${TURN_PORT_TCP}`
        ]
    },
    {
        urls: [
            `turn:${TURN_PUBLIC_IP}:${TURN_PORT_UDP}?transport=udp`,
            `turn:${TURN_PUBLIC_IP}:${TURN_PORT_TCP}?transport=tcp`,
            `turns:${TURN_PUBLIC_IP}:${TURN_PORT_TLS}?transport=tcp`
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

    if (IS_DEV_MODE) {
        res.send(iceServers)
        return
    }

    try {
        const metredApiRes = await fetch(`https://we_meet.metered.live/api/v1/turn/credentials?apiKey=${METERED_API_KEY}`)

        const metredIceServers = await metredApiRes.json();
        res.send([...iceServers,...metredIceServers, ...freeIce()])
    } catch (e) {

    }

})


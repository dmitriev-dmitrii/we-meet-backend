import {Router} from "express";
import {usersService} from "../services/user/usersService.js";
import {env} from "../constatnts/env.js";
import freeIce from "freeice";

const GOOGLE_ICES = [
    {urls: "stun:stun.l.google.com:19302"}, // Обязательно для Firefox
    {urls: "stun:stun1.l.google.com:19302"},
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" }
]
export const usersRouter = Router()

const {METERED_API_KEY, IS_DEV_MODE} = env
usersRouter.post('/auth', async ({body = {}, fingerprint}, res) => {

    const {userName = '',} = body

    const user = await usersService.createUser({fingerprint, userName})

    res.send(user)
})

usersRouter.get('/ice-servers', async (req, res) => {

    const freeIces = [ ...GOOGLE_ICES, ...freeIce()]

    if (IS_DEV_MODE) {
        res.send(freeIces)
        return
    }

    const metredApiRes = await fetch(`https://we_meet.metered.live/api/v1/turn/credentials?apiKey=${METERED_API_KEY}`)

    const iceServers = await metredApiRes.json();

    res.send([...iceServers, ...freeIces])
})


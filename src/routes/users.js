import {Router} from "express";
const usersRouter = Router()

import {User} from "../services/user/endtites/User.js";
usersRouter.post('/auth', async ({body, fingerprint}, res) => {

    const {userName = '',} = body

    const user = new User({fingerprint, userName})

    res.send(user)
})

export default usersRouter;
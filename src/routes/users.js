import {Router} from "express";

const usersRouter = Router()

import {usersService} from "../services/user/usersService.js";

usersRouter.post('/auth', async ({body, fingerprint}, res) => {

    const {userName = '', } = body

    const user = await usersService.createUser({fingerprint, userName})

    res.send(user)
})

export default usersRouter;
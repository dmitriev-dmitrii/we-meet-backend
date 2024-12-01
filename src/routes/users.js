import { Router } from "express";
import {usersService} from "../services/users/usersService.js";
import {constants} from "http2";

const usersRouter = Router()

usersRouter.post('/auth',async ({ body = {}, fingerprint }, res)=> {

  const { userName } = body

  const   userFingerprint = fingerprint.hash

  if (!userName) {
    res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST)
    return
  }

  const user = await  usersService.saveUser({ userName  , userFingerprint } )


  res.send(user) //todo user dto
})

usersRouter.get('/logout',async ({ body = {}, fingerprint }, res)=> {

  const { userId } = body

  const isDeleted = await  usersService.disconnectUser({ userId })

  res.send({isDeleted})
})

export  default  usersRouter;
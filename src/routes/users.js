import { Router } from "express";
import {usersService} from "../services/users/usersService.js";
import {constants} from "http2";

const usersRouter = Router()

// usersRouter.post('/registration', userRegistration);
//
// usersRouter.post('/login',  userLogin );
//
// usersRouter.post('/logout',  userLogout);
//
// usersRouter.put('/refresh-tokens', updateUserAuthTokens );

// usersRouter.get('/',(req, res)=> {
//   res.send('users')
// })

usersRouter.post('/auth',async ({ body, fingerprint }, res)=> {

  const { userName } = body

  const   userFingerprint = fingerprint.hash

  if (!userName) {
    res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST)
    return
  }

  const user = await  usersService.saveUser({ userName  , userFingerprint } )

  const { userId } =user

  res.cookie('userId', userId, {  httpOnly: true , secure: true , sameSite: 'none'});

  res.send(user) //todo user dto
})


export  default  usersRouter;
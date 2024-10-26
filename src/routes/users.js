import { Router } from "express";
import {usersService} from "../services/usersService.js";
import {constants} from "http2";

const usersRouter = Router()

// usersRouter.post('/registration', userRegistration);
//
// usersRouter.post('/login',  userLogin );
//
// usersRouter.post('/logout',  userLogout);
//
// usersRouter.put('/refresh-tokens', updateUserAuthTokens );


usersRouter.get('/',(req, res)=> {
  res.send('users')
})

// usersRouter.post('/save',async ({body}, res)=> {
//
//   const { userName,userId } = body
//
//   if (!userName || !userId) {
//
//     res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST)
//     return
//   }
//
//   const user = await  usersService.saveUser({ userName , userId } )
//
//   res.send(user)
// })


export  default  usersRouter;
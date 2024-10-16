import { Router } from "express";

const meetRouter = Router()

// usersRouter.post('/registration', userRegistration);
//
// usersRouter.post('/login',  userLogin );
//
// meetRouter.post('/logout',  userLogout);
//
// usersRouter.put('/refresh-tokens', updateUserAuthTokens );


meetRouter.post('/create',(req, res)=> {
  const {body} =  req

  res.send('create meet')
})

export  default  meetRouter;
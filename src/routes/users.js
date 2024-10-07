import { Router } from "express";

const usersRouter = Router()

// usersRouter.post('/registration', userRegistration);
//
// usersRouter.post('/login',  userLogin );
//
// usersRouter.post('/logout',  userLogout);
//
// usersRouter.put('/refresh-tokens', updateUserAuthTokens );


usersRouter.get('/',(req, res)=>{
  res.send('users')
})

export  default  usersRouter;
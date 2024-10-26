import { Router } from "express";

const meetRouter = Router()
import {meetService} from "../services/meetService.js";
const {createMeet}=  meetService
// usersRouter.post('/registration', userRegistration);
//
// usersRouter.post('/login',  userLogin );
//
// meetRouter.post('/logout',  userLogout);
//


meetRouter.post('/create',async ({body}, res)=> {

  const meet = await  createMeet()

  res.send(meet)
})

export  default  meetRouter;
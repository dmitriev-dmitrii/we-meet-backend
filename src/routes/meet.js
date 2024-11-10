import { Router } from "express";
import { constants } from "http2";
const meetRouter = Router()
import {meetService} from "../services/meet/meetService.js";
import {usersService} from "../services/users/usersService.js";

meetRouter.get('/:meetId',async ({params}, res)=> {

  const {meetId} = params

  const meet = await  meetService.findMeetById(meetId)

  if (!meet) {
    res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
    return
  }

    // todo meet dto
    res.send(meet)
})

meetRouter.post('/create',async (req, res)=> {
  console.log(req)

  const {body} = req
  const {userId, userName} = body

  if (!userId || !userName) {
    res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
    return
  }

  const meet = await  meetService.createMeet({ userName,userId })

  res.send(meet)
})

meetRouter.post('/join-request',async ({body,cookies}, res)=> {

  const {meetId} = body

  const {userFingerprint} = cookies

  const meet = await meetService.findMeetById(meetId)

  if (!meet) {

    res.sendStatus( constants.HTTP_STATUS_BAD_REQUEST )
    return

  }

  // console.log('meet.meetUsers val', meet.meetUsers.values() )

  const user = await usersService.findUserById(userFingerprint)

  if (!user) {
    res.sendStatus( constants.HTTP_STATUS_UNAUTHORIZED )
    return
  }

  await meet.appendUserToMeet(user)

  user.setMeetId(meet.meetId)



  // todo feature запрос на вход в встречу от юзера
  //  console.log( 'user' , user )

  // todo meet dto
  res.send(meet)
})


export  default  meetRouter;
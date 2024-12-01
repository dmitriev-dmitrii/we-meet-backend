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

meetRouter.post('/create',async ({body,cookies}, res)=> {

  // todo брать id из куки
  const { rtcOffer } = body

  const {userId} = cookies

  if (!userId) {
    res.sendStatus(constants.HTTP_STATUS_UNAUTHORIZED)
    return
  }

  if (!rtcOffer) {
    res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST)
    return
  }


  const meet = await  meetService.createMeet({  userId , rtcOffer } )

  res.send(meet)
})

meetRouter.post('/join-request',async ({body,cookies }, res)=> {
try {

  const {meetId} = body
  const {userId} = cookies

  const meet = await meetService.findMeetById(meetId)

  if (!meet) {
    // TODO create meet
    res.sendStatus( constants.HTTP_STATUS_NOT_FOUND )
    return

  }

  const user = await usersService.findUserById(userId)

  if (!user) {
    console.log('/join-request cant find user by id ', userId )
    res.sendStatus( constants.HTTP_STATUS_UNAUTHORIZED )
    return
  }

  await meet.appendUserToMeet(user)

  user.setMeetId(meet.meetId)

  // todo feature запрос на вход в встречу от юзера
  //  console.log( 'user' , user )

  // todo meet dto

  res.send(meet)

}catch (e) {
  console.log('/join-request', e )
  res.send(e)
}
})


export  default  meetRouter;
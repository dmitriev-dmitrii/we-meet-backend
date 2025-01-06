import { Router } from "express";
import { constants } from "http2";
const meetRouter = Router()
import {meetService} from "../services/meet/meetService.js";
import {MeetDto} from "../services/meet/dto/MeetDto.js";

meetRouter.post('/create',async ({body}, res)=> {

  const { userName , isPrivateMeet } = body

  if (!userName) {
    res.sendStatus( constants.HTTP_STATUS_BAD_REQUEST )
    return
  }

  const meet = await  meetService.createMeet( body )

  res.send(new MeetDto(meet))
})

meetRouter.get('/:meetId',async ({params}, res)=> {

  const {meetId} = params

  const meet = await  meetService.findMeetById(meetId)

  if (!meet) {
    res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
    return
  }

  res.send( new MeetDto( meet ) )
})


meetRouter.post('/:meetId/join-request',async ({body, params, fingerprint }, res)=> {
  try {
    const { meetId } = params
    const { userName } = body

    if (!userName) {
      res.sendStatus( constants.HTTP_STATUS_BAD_REQUEST )
      return
    }

    const meet = await meetService.findMeetById(meetId)

    if (!meet) {
      // TODO create meet
      res.sendStatus( constants.HTTP_STATUS_NOT_FOUND )
      return
    }
    //
    // const user = await usersService.findUserById(userId)
    //
    // if (!user) {
    //   console.log('/join-request cant find user by id ', userId )
    //   res.sendStatus( constants.HTTP_STATUS_UNAUTHORIZED )
    //   return
    // }

    // await meet.joinUserToMeet(user)

    // todo feature запрос на вход в встречу от юзера
    //  console.log( 'user' , user )


   const user =  await  meet.appendUserToMeet({ userName, fingerprint })



    res.send({...new MeetDto(meet) , user } )

  } catch (e) {
    console.log('/join-request', e )
    res.send(e)
  }
})


export  default  meetRouter;
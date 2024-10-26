import { Router } from "express";
import { constants } from "http2";
const meetRouter = Router()
import {meetService} from "../services/meetService.js";
const { createMeet, findMeetById } = meetService
meetRouter.get('/:meetId',async ({params}, res)=> {

  const {meetId} = params

  const meet = await  findMeetById(meetId)

  if (meet) {
    res.send(meet)
    return
  }

  res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
})

meetRouter.post('/create',async ({body}, res)=> {

  const {userId, userName} = body

  const meet = await  createMeet({ userName,userId })

  res.send(meet)
})

export  default  meetRouter;
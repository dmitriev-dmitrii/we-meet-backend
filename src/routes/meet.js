import {Router} from "express";
import {constants} from "http2";
import {meetService} from "../services/meet/meetService.js";
import {MeetDto} from "../services/meet/dto/MeetDto.js";
import {usersService} from "../services/user/usersService.js";

// TODO ручку на получение списка meets
export const meetRouter = Router()
meetRouter.post('/create', async ({body = {}}, res) => {

    const { userId = '', password = ''} = body

    if (!userId) {
        res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST)
        return
    }

    const meet = await meetService.createMeet(body)

    res.send(new MeetDto(meet))
})

meetRouter.get('/:meetId', async ({params}, res) => {

    const {meetId} = params

    const meet = await meetService.findMeetById(meetId)

    if (!meet) {
        res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
        return
    }

    res.send(new MeetDto(meet))
})


meetRouter.post('/:meetId/join-request', async ({body, params, fingerprint}, res) => {
    try {
        const {meetId} = params
        const {userId} = body

        if (!userId) {
            res.sendStatus(constants.HTTP_STATUS_BAD_REQUEST)
            return
        }

        const meet = await meetService.findMeetById(meetId)


        if (!meet) {
            res.sendStatus(constants.HTTP_STATUS_NOT_FOUND)
            return
        }

        const user = await usersService.findUserById(userId)

        user.isOwner = meet.ownerUserId === user.userId
        user.meetId = meet.meetId

        // todo feature запрос на вход в встречу от юзера
        //  console.log( 'user' , user )

        res.send({...new MeetDto(meet)})


    } catch (e) {
        console.log('/join-request', e)
        res.send(e)
    }
})



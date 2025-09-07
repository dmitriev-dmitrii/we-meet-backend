import {Router} from "express";
import {constants} from "http2";
import {meetService} from "../services/meet/meetService.js";
import {MeetDto} from "../services/meet/dto/MeetDto.js";
import {usersService} from "../services/user/usersService.js";
import {AppError} from "../midlwares/errorMiddlware.js";

// TODO ручку на получение списка meets
export const meetRouter = Router()
meetRouter.post('/create', async ({body = {}}, res) => {

    const {userId = '', password = ''} = body

    if (!userId) {
        throw new AppError({
            status: constants.HTTP_STATUS_BAD_REQUEST, details: [
                {
                    field: "userId",
                    message: "userId is required field",
                },
            ],
        })
    }

    const meet = await meetService.createMeet(body)

    res.send(new MeetDto(meet))
})

meetRouter.get('/:meetId', async ({params}, res) => {

    const {meetId} = params

    const meet = await meetService.findMeetById(meetId)

    if (!meet) {
        throw new AppError({
            status: constants.HTTP_STATUS_NOT_FOUND,
            message: `Not Found MeetId: ${meetId}`
        })
    }

    res.send(new MeetDto(meet))
})


meetRouter.post('/:meetId/join-request', async ({body, params, fingerprint}, res) => {
        const {meetId} = params
        const {userId} = body

        if (!userId) {
            throw new AppError({
                status: constants.HTTP_STATUS_BAD_REQUEST,
                details: [
                    {
                        field: "userId",
                        message: "userId is required field",
                    },
                ],
            })
        }

        const meet = await meetService.findMeetById(meetId)

        if (!meet) {
            throw new AppError({
                status: constants.HTTP_STATUS_NOT_FOUND,
                message: `Not Found meetId: ${meetId}`
            })
        }

        const user = await usersService.findUserById(userId)

        // user.isOwner = meet.ownerUserId === user.userId
        // user.meetId = meet.meetId

        // throw new AppError({
        //     status: constants.HTTP_STATUS_BAD_REQUEST,
        //     details: [
        //         {
        //             field: "password",
        //             message: " password is required",
        //         },
        //     ],
        // })

        // todo feature запрос на вход в встречу от юзера
        //  console.log( 'user' , user )

        res.send({...new MeetDto(meet)})
})



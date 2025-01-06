import { constants } from "http2";


export  const errorMiddleware  = (err, req , res , next )=> {

    const { url } = req

    console.log(url)

    console.log(err.stack)

    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send(err.stack)
}
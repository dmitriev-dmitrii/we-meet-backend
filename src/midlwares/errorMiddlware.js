import {constants} from "http2";
import {STATUS_CODES} from "http";


export class AppError extends Error {
    constructor({message= '', status, details}) {
        super(message); // Вызываем конструктор Error

        this.status = status ?? constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
        this.statusText = STATUS_CODES[this.status]
        this.message = message
        this.details = details
        // Создаем чистый stack trace без упоминания конструктора AppError
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorMiddleware = (err, req, res, next) => {

    console.log('errorMiddleware', err)

    if (err instanceof AppError) {
        const {status, statusText, message} = err
        res.status(status).send({statusText, status, message});
    } else {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send('Unexpected Error')
    }

    next()
}
import dotenv from 'dotenv'

dotenv.config()

const IS_DEV_MODE = process.env.MODE  === 'dev';
const IS_PROD_MODE =  !IS_DEV_MODE;

export const env = {
    ...process.env,
    IS_PROD_MODE,
    IS_DEV_MODE,
}


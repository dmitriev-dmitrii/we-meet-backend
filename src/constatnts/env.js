import dotenv from 'dotenv'

dotenv.config()

const IS_PROD_MODE =  process.env.MODE  === 'production';
const IS_DEV_MODE = !IS_PROD_MODE;

export const env = {
    ...process.env,
    IS_PROD_MODE,
    IS_DEV_MODE,
}


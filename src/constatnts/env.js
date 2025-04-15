import dotenv from 'dotenv'

const { parsed } = dotenv.config()

const IS_PROD_MODE = parsed.MODE === 'production'
const IS_DEV_MODE = parsed.MODE === 'development'
export const env = {
    IS_PROD_MODE,
    IS_DEV_MODE,
    ...parsed
}


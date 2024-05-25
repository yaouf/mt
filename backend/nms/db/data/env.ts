import { cleanEnv, str } from 'envalid'

import dotenv from 'dotenv';

// // Load environment variables from .env file
dotenv.config();

const env = cleanEnv(process.env, {
    DB_URL: str(),
  ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
})

export default env;
import { cleanEnv, str } from 'envalid';

import dotenv from 'dotenv';

// // Load environment variables from .env file
dotenv.config();

const env = cleanEnv(process.env, {
  DB_URL: str({devDefault: ''}),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  DB_USER: str({devDefault: ''}),
  DB_PASSWORD: str({devDefault: ''}),
  DB_NAME: str({devDefault: ''}),
})

if (['staging'].includes(env.NODE_ENV) && !env.DB_URL) {
  throw new Error('DB_URL is required in staging environment');
}

export default env;
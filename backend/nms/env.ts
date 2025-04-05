import dotenv from 'dotenv';
import { cleanEnv, str } from 'envalid';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ENV = process.env.ENV ?? 'development';
// const NODE_ENV = process.env.NODE_ENV ?? 'development';

dotenv.config({ path: path.resolve(process.cwd(), `.env.${ENV}`) });
console.log(path.resolve(process.cwd(), `.env.${ENV}`));

// dotenv.config({ path: path.resolve(process.cwd(), `.env.${NODE_ENV}`) });
// console.log(path.resolve(process.cwd(), `.env.${NODE_ENV}`) );

const env = cleanEnv(process.env, {
  DB_URL: str({ devDefault: '' }),
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  ENV: str({
    choices: ['development', 'test', 'staging', 'production'],
    desc: 'This is used to specify app environment, since NODE_ENV only permits 3 values. ',
  }),
  DB_USER: str({ devDefault: '' }),
  DB_PASSWORD: str({ devDefault: '' }),
  DB_NAME: str({ devDefault: '' }),
  NEXT_PUBLIC_FB_API_KEY: str(),
  NEXT_PUBLIC_FB_AUTH_DOMAIN: str(),
  NEXT_PUBLIC_FB_PROJECT_ID: str(),
  NEXT_PUBLIC_FB_STORAGE_BUCKET: str(),
  NEXT_PUBLIC_FB_MESSAGING_SENDER_ID: str(),
  NEXT_PUBLIC_FB_APP_ID: str(),
  NEXT_PUBLIC_FB_MEASUREMENT_ID: str(),
});
export default env;

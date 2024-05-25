import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
    DB_URL: str(),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
})

export default env;
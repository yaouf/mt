import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  DB_URL: str({ devDefault: "" }),
  NODE_ENV: str({ choices: ["development", "test", "staging", "production"] }),
  DB_USER: str({ devDefault: "" }),
  DB_PASSWORD: str({ devDefault: "" }),
  DB_NAME: str({ devDefault: "" }),
});

export default env;

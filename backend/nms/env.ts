import { cleanEnv, str } from "envalid";

const env = cleanEnv(process.env, {
  ALLOWED_WEBSITE_URL: str({devDefault: '*'}),
    DB_URL: str({devDefault: ''}),
  NODE_ENV: str({ choices: ['development', 'test', 'staging', 'production']  }),
  DB_USER: str({devDefault: ''}),
  DB_PASSWORD: str({devDefault: ''}),
  DB_NAME: str({devDefault: ''}),
  NEXT_PUBLIC_FB_API_KEY: str(),
  NEXT_PUBLIC_FB_AUTH_DOMAIN: str(),
  NEXT_PUBLIC_FB_PROJECT_ID: str(),
  NEXT_PUBLIC_FB_STORAGE_BUCKET: str(),
  NEXT_PUBLIC_FB_MESSAGING_SENDER_ID: str(),
  NEXT_PUBLIC_FB_APP_ID: str(),
  NEXT_PUBLIC_FB_MEASUREMENT_ID: str(),
})
export default env;
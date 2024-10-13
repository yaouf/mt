import { defineString } from "firebase-functions/params";
const environment = defineString("ENV", {
  default: "development",
  description: "this defines the env is on production or development or staging",
});
console.log(`Environment: ${environment}`);
const dbUrl = defineString("DB_URL", {
    default: "",
    description: "this defines the db url for staging",
});
const trustedApiKey = defineString("API_KEY", {
    default: "",
    description: "this defines the trusted api key",

});
const dbName = defineString("DB_NAME", {
  default: "",
  description: "if using prod db, this is the db name",
});
const dbUser = defineString("DB_USER", {
  default: "",
  description: "if using prod db, this is the db user",
});
const dbPassword = defineString("DB_PASSWORD", {
  default: "",
  description: "if using prod db, this is the db password",
});

const envars = { environment, dbUrl, trustedApiKey, dbName, dbUser, dbPassword};
export default envars;

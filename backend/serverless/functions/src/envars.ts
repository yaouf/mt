import { defineString } from "firebase-functions/params";
// TODO: dont use .value()
const environment = defineString("ENV", {
  default: "development",
  description: "this defines the env is on production or development or staging",
}).value();
console.log(`Environment: ${environment}`);
const stagingDbUrl = defineString("DB_URL", {
    default: "",
    description: "this defines the db url for staging",
}).value();
const trustedApiKey = defineString("API_KEY", {
    default: "",
    description: "this defines the trusted api key",

}).value();
const dbName = defineString("DB_NAME", {
  default: ""
}).value();
const dbUser = defineString("DB_USER", {
  default: ""
}).value();
const dbPassword = defineString("DB_PASSWORD", {
  default: ""
}).value();

const envars = { environment, stagingDbUrl, trustedApiKey, dbName, dbUser, dbPassword};
export default envars;
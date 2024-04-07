import { defineString } from "firebase-functions/params";

const environment = defineString("ENV").value();
console.log(`Environment: ${environment}`);
const stagingDbUrl = defineString("DB_URL").value();
const trustedApiKey = defineString("API_KEY").value();
const envars = { environment, stagingDbUrl, trustedApiKey};
export default envars;
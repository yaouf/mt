// Start writing functions

import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
// https://firebase.google.com/docs/functions/typescript
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Congrats on getting firebase setup!");
});
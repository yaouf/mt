import { user } from "firebase-functions/v1/auth";
import * as logger from "firebase-functions/logger";

export const createUser = user().onCreate(user => {
  logger.info("Creating a new user", { structuredData: true });
  // TODO SANA: create a new user in user table with userId, email, name
});

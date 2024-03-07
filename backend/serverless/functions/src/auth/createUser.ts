import { user } from "firebase-functions/v1/auth";
import * as logger from "firebase-functions/logger";
import db from "../../../../db/data/db-config";

export const createUser = user().onCreate(async user => {
  logger.info("Creating a new user", { structuredData: true });
  // TODO SANA: create a new user in user table with userId, email, name
  // Look at Firebase docs for structure of user object

   // Insert new user into SQL table
   try {
     await db("users").insert({
       userId: user.uid,
       email: user.email,
       name: user.displayName,
     });
     logger.info("User added to database successfully", {
       structuredData: true,
     });
   } catch (error) {
     logger.error("Error adding user to database:", error, {
       structuredData: true,
     });
   }
});

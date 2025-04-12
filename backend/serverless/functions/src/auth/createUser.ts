import { user } from "firebase-functions/v1/auth";
import * as logger from "firebase-functions/logger";
import db from "../../../db/dist/data/db-config";

/**
 * Firebase Cloud Function that is triggered when a new user is created.
 * 
 * This function inserts the new user's data (UID, email, and name) into the SQL database.
 * It also logs the success or failure of the operation to Firebase logger.
 *
 * @function
 * @name createUser
 * @param {user} user - The Firebase user object containing user information, including UID, email, and display name.
 * @returns {Promise<void>} A promise that resolves when the user is successfully added to the database or logs an error if the insertion fails.
 * 
 * @example
 * // Triggered when a Firebase user is created.
 * createUser(user).then(() => console.log("User created successfully"));
 */
export const createUser = user().onCreate(async user => {
  logger.info("Creating a new user", { structuredData: true });
  
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

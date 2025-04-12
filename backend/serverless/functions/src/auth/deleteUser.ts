import { user } from "firebase-functions/v1/auth";
import * as logger from "firebase-functions/logger";
import db from "../../../db/dist/data/db-config";

/**
 * Firebase Cloud Function that is triggered when a user is deleted.
 * 
 * This function deletes the user from the SQL database using the user ID (UID).
 * It also logs the success or failure of the operation to Firebase logger.
 *
 * @function
 * @name deleteUser
 * @param {user} user - The Firebase user object containing user information, including UID.
 * @returns {Promise<void>} A promise that resolves when the user is successfully deleted or logs an error if the deletion fails.
 * 
 * @example
 * // Triggered when a Firebase user is deleted.
 * deleteUser(user).then(() => console.log("User deleted successfully"));
 */
export const deleteUser = user().onDelete(async user => {
  logger.info("Deleting a user", { structuredData: true });

  // Delete user from SQL table
  try {
    await db("users").where({ userId: user.uid }).del();
    logger.info("User deleted from database successfully", {
      structuredData: true,
    });
  } catch (error) {
    logger.error("Error deleting user from database:", error, {
      structuredData: true,
    });
  }
});

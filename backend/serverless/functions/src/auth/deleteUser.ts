// TODO FOR LATER SPRINT

import { user } from "firebase-functions/v1/auth";
import * as logger from "firebase-functions/logger";
import db from "../../../db/dist/data/db-config";

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

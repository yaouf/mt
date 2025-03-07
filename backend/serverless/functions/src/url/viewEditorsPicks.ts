import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import dbFactory from "../../../db/dist/data/db-config";
import { validateApiKey } from "../utils";

/**
 * Gets the editors picks from the editors_picks table.
 * Used by BDH app for search page.
 */
export const viewEditorsPicks = onRequest(async (request, response) => {
  if (!validateApiKey(request, response)) return;

  logger.info("Viewing editors picks", { structuredData: true });

  try {
    // Initialize the database connection
    const db = dbFactory({ environment: process.env.ENV || "test" });

    const result = await db("editors_picks")
      .select("url", "rank")
      .orderBy("rank", "asc");

    await db.destroy();

    logger.info(`Editors picks: ${result}`);
    response.status(200).send(result);
  } catch (error) {
    // TODO: add destroy to all function calls even if there is an error
    // Make sure db is initialized before trying to destroy it
    try {
      const db = dbFactory({ environment: process.env.ENV || "test" });
      await db.destroy();
    } catch (destroyError) {
      logger.error("Error destroying DB connection:", destroyError);
    }

    logger.error("Error getting editors picks:", error);
    response.status(500).send("Error: " + error);
  }
});

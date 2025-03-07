import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import dbFactory from "../../../db/dist/data/db-config";
import { validateApiKey } from "../utils";
import envars from "../envars";

/**
 * Implementation function for getting editors picks
 * This allows for dependency injection during testing
 */
export const viewEditorsPicksImplementation = async (
  request: any, 
  response: any, 
  dbConnection?: any
) => {
  if (!validateApiKey(request, response)) return;

  logger.info("Viewing editors picks", { structuredData: true });

  try {
    // Initialize the database connection unless one was provided (for testing)
    const db = dbConnection || dbFactory({ environment: envars.environment.value });

    const result = await db("editors_picks")
      .select("url", "rank")
      .orderBy("rank", "asc");

    await db.destroy();

    logger.info(`Editors picks: ${result}`);
    response.status(200).send(result);
  } catch (error) {
    // Make sure db is initialized before trying to destroy it
    try {
      if (!dbConnection) {
        const db = dbFactory({ environment: envars.environment.value });
        await db.destroy();
      }
    } catch (destroyError) {
      logger.error("Error destroying DB connection:", destroyError);
    }

    logger.error("Error getting editors picks:", error);
    response.status(500).send("Error: " + error);
  }
};

/**
 * Gets the editors picks from the editors_picks table.
 * Used by BDH app for search page.
 */
export const viewEditorsPicks = onRequest(async (request, response) => {
  return viewEditorsPicksImplementation(request, response);
});

import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../../db/dist/data/db-config";
import envars from "../envars";
import { validateApiKey } from "../utils";

/**
 * Gets the editors picks from the editors_picks table.
 * Used by BDH app for search page. 
 */
export const viewEditorsPicks = onRequest(async (request, response) => {
  if (!validateApiKey(request, response)) return;
  const environment = envars.environment.value();
  const dbUrl = envars.dbUrl.value();
  const dbParams = { environment, dbUrl };
  logger.info("dbParams: ", dbParams);

  logger.info("Viewing editors picks", { structuredData: true });

  try {
    // Get the editors picks from the editors_picks table
    // TODO: Change table name to editors_picks
    const result = await db(dbParams)("editors_picks").select("url");

    logger.info(`Editors picks: ${result}`);

    // Send the editors picks back to the client
    response.status(200).send(result);
  } catch (error) {
    logger.error("Error getting editors picks:", error);
    response.status(500).send("Error: " + error);
  }
});

import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../../db/dist/data/db-config";
import { defineString } from "firebase-functions/params";
import envars from "../envars";

export const viewSettings = onRequest(async (request, response) => {
  // Get the API key from the environment variables
  const API_KEY = defineString("API_KEY").value();
  // Get the apiKey from the request headers
  const apiKey = request.get("X-API-KEY");
  // Check if the API key is correct
  if (!apiKey || apiKey !== API_KEY) {
    response.status(401).send("Unauthorized");
    return;
  }

  try {

    logger.info("Getting user settings", { structuredData: true });
    
    // Destructure potential fields from request body
    const { deviceId } = request.body;
    // Validate request body
    if (deviceId === undefined) {
      response
        .status(400)
        .send(
          "Invalid request body. Must include a deviceID to view settings for."
        );
      return;
    }

    // Get the device settings in device table (Is the first necessary?  @Jakobi Haskell\)
    const { environment, stagingDbUrl } = envars;
    const dbParams = { environment, stagingDbUrl };
    const settings = await db(dbParams)("devices")
    .where("id", deviceId)
    .select("Weekly Summary", "Daily Summary", "Breaking News")
    .first();

    // Check if the device's settings exist. If not, assume the device doesn't exist
    if (!settings) {
      // If the device doesn't exist, return an error response
      response.status(404).send("Device ID not found.");
      return;
    }

    // Log and send the settings
    logger.info("Device settings sent", { deviceId, settings });
    response.send(settings);
    return;
    
  } catch (error) {
    logger.error("Error viewing settings", error);
    response.status(500).send("Error viewing settings");
    return;
  }
});

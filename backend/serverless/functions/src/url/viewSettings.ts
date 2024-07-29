import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../../db/dist/data/db-config";
import { defineString } from "firebase-functions/params";
import envars from "../envars";
import Joi from "joi";
import validateUuidV4 from "../validateUuidV4";

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
    // Schema for request body validation
    const schema = Joi.object({
      deviceId: Joi.string().required()
    });
    // Validate request body
    const { error, value: validBody } = schema.validate(request.body);
    if (error) {
      response.status(400).send("Request body validation error: " + error.message);
      return;
    }
    const { deviceId } = validBody;  
    // TODO: how to use types with Joi
    // Validate deviceId, make sure its uuid v4
    if (!validateUuidV4(deviceId)) {
      response.status(400).send("Request body validation error: \"deviceId\" is not a valid UUID v4.");
      return;
    }  
    logger.info("Device ID received", { deviceId });
    // Get the device settings in device tables
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

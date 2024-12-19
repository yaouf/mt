import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import Joi from "joi";
import db from "../../../db/dist/data/db-config";
import envars from "../envars";
import { validateApiKey, validateUuidV4 } from "../utils";

/**
 * Gets the settings for a device.
 * Takes a deviceId and returns an object with the keys "Breaking News", "University News", "Metro", and "isPushEnabled"
 * and their corresponding boolean values.
 * Called when a user goes to the settings screen in the app.
 */
export const viewSettings = onRequest(async (request, response) => {
  if (!validateApiKey(request, response)) return;
  const environment = envars.environment.value();
  const dbUrl = envars.dbUrl.value();
  const dbParams = { environment, dbUrl };
  const newDb = db(dbParams);
  try {

    // logger.info("Getting user settings", { structuredData: true });
    // Destructure potential fields from request body
    // Schema for request body validation
    const schema = Joi.object({
      deviceId: Joi.string().required()
    });
    // Validate request body
    const { error, value: validBody } = schema.validate(request.body);
    if (error) {
      logger.error("Request body validation error: " + error.message, { requestBody: request.body });
      response.status(400).send("Request body validation error: " + error.message);
      return;
    }
    const { deviceId } = validBody;  
    // TODO: how to use types with Joi
    // Validate deviceId, make sure its uuid v4
    if (!validateUuidV4(deviceId)) {
      logger.error("Request body validation error: \"deviceId\" is not a valid UUID v4.", { deviceId });
      response.status(400).send("Request body validation error: \"deviceId\" is not a valid UUID v4.");
      return;
    }  
    logger.info("Device ID received", { deviceId });
    // Get the device settings in device tables
    const settings = await newDb("devices")
    .where("id", deviceId)
    .select("University News", "Metro", "Breaking News", "Opinions", "Arts and Culture", "Sports", "Science and Research", "isPushEnabled")
    .first();

    await newDb.destroy();


    // Check if the device's settings exist. If not, assume the device doesn't exist
    if (!settings) {
      logger.error("Device ID not found.", { deviceId });
      // If the device doesn't exist, return an error response
      response.status(404).send("Device ID not found.");
      return;
    }

    // Log and send the settings
    logger.info("Device settings sent for deviceId: ", { deviceId, settings });
    response.send(settings);
    return;
    
  } catch (error) {
    logger.error("Error viewing settings", error);
    response.status(500).send("Error viewing settings");
    return;
  }
});

import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../../db/dist/data/db-config";
import envars from "../envars";
import Joi from "joi";
import validateUuidV4 from "../validateUuidV4";
export const updateNotificationStatus = onRequest(async (request, response) => {
  // Get the API key from the environment variables
  const { trustedApiKey, environment, stagingDbUrl } = envars;

  // Get the apiKey from the request headers
  const untrustedApiKey = request.get("X-API-KEY");

  // Check if the API key is correct
  if (!untrustedApiKey || untrustedApiKey !== trustedApiKey) {
    // TODO: make this more descriptive
    response.status(401).send("API Key is invalid.");
    return;
  }

    // Request body validation schema
  const schema = Joi.object({
    deviceId: Joi.string().required(),
    isPushEnabled: Joi.boolean().required(),
  });

  // Validate request body
  const { error, value: validBody } = schema.validate(request.body);
  if (error) {
    response.status(400).send("Request body validation error: " + error.message);
    return;
  }

  // Validate deviceId, make sure its uuid v4
  if (!validateUuidV4(validBody.deviceId)) {
    response.status(400).send("Request body validation error: \"deviceId\" is not a valid UUID v4.");
    return;
  }

  // Extract ID and currentNotificationStatus from request body
  const { deviceId, isPushEnabled } = validBody;

  const dbParams = { environment, stagingDbUrl };

  try {
    // Check the current status in the database
    const device = await db(dbParams)("devices").where("id", deviceId).first();
    if (!device) {
      response.status(404).send("Device not found. Are you sure \"deviceId\" is correct?");
      return;
    }

    // Compare current status with the new status
    if (device.isPushEnabled !== isPushEnabled) {
      // Update the notification status in the database
      await db(dbParams)("devices").where("id", deviceId).update({
        isPushEnabled,
      });
      logger.info("Notification status updated", {
        id: deviceId,
        status: isPushEnabled,
      });
      response.send("Notification status updated.");
    } else {
      // If the status is the same, inform the user no update was necessary
      response.send("No update necessary; status is already set as provided.");
    }
  } catch (error) {
    logger.error("Error updating notification status", error);
    response.status(500).send("Error updating notification status");
  }
});

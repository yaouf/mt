import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import Joi from "joi";
import db from "../../../db/dist/data/db-config";
import envars from "../envars";
import { validateApiKey, validateUuidV4 } from "../utils";

/**
 * Updates the boolean that indicates whether a device should receive push notifications.
 * Takes a deviceId and a boolean value for isPushEnabled to update to.
 * Called when a user subscribes or unsubscribes from push notifications in iOS Settings.
 */
export const updateNotificationStatus = onRequest(async (request, response) => {
  if (!validateApiKey(request, response)) return;

  // Call .value() in runtime 
  const environment = envars.environment.value();
  const dbUrl = envars.dbUrl.value();

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

  const dbParams = { environment, dbUrl };

  try {
    // Check the current status in the database
    const device = await db(dbParams)("devices").where("id", deviceId).first();
    if (!device) {
      response.status(404).send("Device not found. Are you sure field \"deviceId\" is correct?");
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

import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import Joi from "joi";
import dbFactory from "../../../db/dist/data/db-config";
import { validateApiKey, validateUuidV4 } from "../utils";

/**
 * Updates the boolean that indicates whether a device should receive push notifications.
 * Takes a deviceId and a boolean value for isPushEnabled to update to.
 * Called when a user subscribes or unsubscribes from push notifications in iOS Settings.
 * NOTE: Not currently in use.
 */
export const updateNotificationStatus = onRequest(async (request, response) => {
  if (!validateApiKey(request, response)) return;

  try {
    // Initialize the database connection
    const db = dbFactory({ environment: process.env.ENV || "test" });
    
    // Request body validation schema
    const schema = Joi.object({
      deviceId: Joi.string().required(),
      isPushEnabled: Joi.boolean().required(),
    });

    // Validate request body
    const { error, value: validBody } = schema.validate(request.body);
    if (error) {
      logger.error("Request body validation error: " + error.message);
      response
        .status(400)
        .send("Request body validation error: " + error.message);
      return;
    }

    // Validate deviceId, make sure its uuid v4
    if (!validateUuidV4(validBody.deviceId)) {
      logger.error('Request body validation error: "deviceId" is not a valid UUID v4.');
      response
        .status(400)
        .send(
          'Request body validation error: "deviceId" is not a valid UUID v4.'
        );
      return;
    }

    // Extract ID and currentNotificationStatus from request body
    const { deviceId, isPushEnabled } = validBody;
    // Check the current status in the database
    const device = await db("devices").where("id", deviceId).first();
    if (!device) {
      logger.error('Device not found. Are you sure field "deviceId" is correct?', { deviceId });
      response
        .status(404)
        .send('Device not found. Are you sure field "deviceId" is correct?');
      return;
    }

    // Compare current status with the new status
    if (device.is_push_enabled !== isPushEnabled) {
      // Update the notification status in the database
      await db("devices").where("id", deviceId).update({
        is_push_enabled: isPushEnabled,
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

    await db.destroy();
  } catch (error) {
    // Make sure to destroy the DB connection even in case of error
    try {
      const db = dbFactory({ environment: process.env.ENV || "test" });
      await db.destroy();
    } catch (destroyError) {
      logger.error("Error destroying DB connection:", destroyError);
    }
    
    logger.error("Error updating notification status", error);
    response.status(500).send("Error updating notification status");
  }
});

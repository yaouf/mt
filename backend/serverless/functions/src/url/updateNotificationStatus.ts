import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../../db/dist/data/db-config";
import envars from "../envars";

export const updateNotificationStatus = onRequest(async (request, response) => {
  // Get the API key from the environment variables
  const { trustedApiKey, environment, stagingDbUrl } = envars;

  // Get the apiKey from the request headers
  const untrustedApiKey = request.get("X-API-KEY");

  // Check if the API key is correct
  if (!untrustedApiKey || untrustedApiKey !== trustedApiKey) {
    // TODO: make this more descriptive
    response.status(401).send("Unauthorized");
    return;
  }

  // Extract ID and currentNotificationStatus from request body
  const { deviceId: id, isPushEnabled } = request.body;

  // Validate request body
  // TODO: use a library for api body validation
  if (typeof id === "undefined" || typeof isPushEnabled === "undefined") {
    response
      .status(400)
      .send("Both ID and current notification status are required.");
    return;
  }

  const dbParams = { environment, stagingDbUrl };

  try {
    // Check the current status in the database
    const device = await db(dbParams)("devices").where("id", id).first();
    if (!device) {
      response.status(404).send("Device not found.");
      return;
    }

    // Compare current status with the new status
    if (device.isPushEnabled !== isPushEnabled) {
      // Update the notification status in the database
      await db(dbParams)("devices").where("id", id).update({
        isPushEnabled,
      });
      logger.info("Notification status updated", {
        id: id,
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

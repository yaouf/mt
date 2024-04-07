import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../../db/dist/data/db-config";
import envars from "../envars";
export const updateSettings = onRequest(async (request, response) => {
  // Get the API key from the environment variables
  const { trustedApiKey } = envars;

  // Get the apiKey from the request headers
  const untrustedApiKey = request.get("X-API-KEY");

  // Check if the API key is correct
  if (!untrustedApiKey || untrustedApiKey !== trustedApiKey) {
    response.status(401).send("Unauthorized");
    return;
  }

  try {
    logger.info("Updating user settings", { structuredData: true });

    // Destructure potential fields from request body
    const { breakingNewsAlerts, weeklySummaryAlerts } = request.body;

    // Validate request body
    if (breakingNewsAlerts === undefined && weeklySummaryAlerts === undefined) {
      response
        .status(400)
        .send(
          "Invalid request body. Must include at least one setting to update."
        );
      return;
    }

    // Construct update object based on what's provided in the request body
    const updateData = {
      breakingNewsAlerts: false,
      weeklySummaryAlerts: false,
    };
    if (breakingNewsAlerts !== undefined) {
      updateData.breakingNewsAlerts = breakingNewsAlerts;
    }
    if (weeklySummaryAlerts !== undefined) {
      updateData.weeklySummaryAlerts = weeklySummaryAlerts;
    }

    // Assuming there's a way to identify the device/user to update, for example, a deviceId in the request
    // This part is missing in your provided code, so adding a placeholder
    const deviceId = request.body.deviceId; // You would need to handle this part

    if (!deviceId) {
      response.status(400).send("Device ID is required.");
      return;
    }

    // First, check if the device exists
    const deviceExists = await db("devices").where("id", deviceId).first();
    if (!deviceExists) {
      // If the device doesn't exist, return an error response
      response.status(404).send("Device ID not found.");
      return;
    }

    // Update device settings in device table
    const res = await db("devices").where("id", deviceId).update(updateData);
    // log the result of the update
    console.log(res);
    // Log the result of update - For logging purposes, might query again or just log the update was successful
    logger.info("Device settings updated", { deviceId, updates: updateData });

    response.send("Settings updated!");
    return;
  } catch (error) {
    logger.error("Error updating settings", error);
    response.status(500).send("Error updating settings");
    return;
  }
});

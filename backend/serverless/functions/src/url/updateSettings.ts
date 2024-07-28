import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../../db/dist/data/db-config";
import envars from "../envars";
export const updateSettings = onRequest(async (request, response) => {
  // Get the API key from the environment variables
  const { trustedApiKey, environment, stagingDbUrl } = envars;
  const dbParams = { environment, stagingDbUrl };

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
    const breakingNews = request.body["Breaking News"];
    const weeklySummary = request.body["Weekly Summary"];
    const dailySummary = request.body["Daily Summary"];

    // Validate request body
    if (breakingNews === undefined && weeklySummary === undefined && dailySummary === undefined) {
      response
        .status(400)
        .send(
          "Invalid request body. Must include at least one setting to update."
        );
      return;
    }

    // Define the type of updateData
    type UpdateData = {
      "Breaking News"?: boolean;
      "Weekly Summary"?: boolean;
      "Daily Summary"?: boolean;
    };
    
    // Construct update object based on what's provided in the request body
    const updateData: UpdateData = {};
    if (breakingNews !== undefined) {
      updateData["Breaking News"] = breakingNews;
    }
    if (weeklySummary !== undefined) {
      updateData["Weekly Summary"] = weeklySummary;
    }
    if (dailySummary !== undefined) {
      updateData["Daily Summary"] = dailySummary;
    }

    // Get the device ID from the request body
    const deviceId = request.body.deviceId; 

    if (!deviceId) {
      response.status(400).send("Device ID is required.");
      return;
    }

    // First, check if the device exists
    const deviceExists = await db(dbParams)("devices").where("id", deviceId).first();
    if (!deviceExists) {
      // If the device doesn't exist, return an error response
      response.status(404).send("Device ID not found.");
      return;
    }

    // Update device settings in device table
    const res = await db(dbParams)("devices").where("id", deviceId).update(updateData);
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

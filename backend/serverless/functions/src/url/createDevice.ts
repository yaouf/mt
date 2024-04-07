import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../../db/dist/data/db-config";
import { v4 as uuidv4 } from "uuid";
import envars from "../envars";
export const createDevice = onRequest(async (request, response) => {
  // Get the apiKey from the request headers
  const untrustedApiKey = request.get("X-API-KEY");

  const { environment, stagingDbUrl, trustedApiKey } = envars;
  const dbParams = { environment, stagingDbUrl };
  console.log("dbParams: ", dbParams);
  console.log(untrustedApiKey, trustedApiKey);
  // Check if the API key is correct
  if (!untrustedApiKey || untrustedApiKey !== trustedApiKey) {
    response.status(401).send("Unauthorized");
    return;
  }

  logger.info("Creating a new device", { structuredData: true });
  // creates a new device in device table with deviceId, deviceType, breakingNewsAlerts, weeklySummaryAlerts, expoPushToken? (optional)
  // Assume info above is in request body as json. If any required fields are missing, return an error status code

  try {
    // Extract device information from the request body
    // The "|| {}" portion at the end ensures that if there are any issues with request.body line 12 won't throw an error
    const { deviceType, expoPushToken } = request.body || {};
    const breakingNews = request.body["Breaking News"];
    const weeklySummary = request.body["Weekly Summary"];
    const dailySummary = request.body["Daily Summary"];
    if (
      !deviceType || !expoPushToken ||
      typeof breakingNews !== "boolean" ||
      typeof weeklySummary !== "boolean" ||
      typeof dailySummary !== "boolean"
    ) {
      response.status(400).send("Missing required fields in request body");
      return;
    }
    // Insert the device into the devices table, and return the id of the inserted row
    const insertedRows = await db(dbParams)("devices")
      .insert({
        id: uuidv4(), // Generate a new UUID for the device
        deviceType: deviceType,
        "Breaking News": breakingNews,
        "Weekly Summary": weeklySummary,
        "Daily Summary": dailySummary,
        expoPushToken: expoPushToken, // Should always exist, even if notifications were denied, but right now it's optional
      })
      .returning("id");
    // Only return id to the client if the insert was successful
    console.log(insertedRows);

    // Select all from devices table and log result
    const allDevices = await db(dbParams)("devices").select();
    console.log(allDevices);

    response.send({
      deviceId: insertedRows[0].id,
    });
  } catch (error) {
    console.error("Error creating device:", error);
    response.status(500).send("Error: " + error);
  }
});

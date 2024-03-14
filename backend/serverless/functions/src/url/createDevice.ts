import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../../../db/data/db-config";

export const createDevice = onRequest(async (request, response) => {
  logger.info("Creating a new device", { structuredData: true });
  // creates a new device in device table with deviceId, deviceType, breakingNewsAlerts, weeklySummaryAlerts, expoPushToken? (optional)
  // Assume info above is in request body as json. If any required fields are missing, return an error status code

  try {
    // Extract device information from the request body
    // The "|| {}" portion at the end ensures that if there are any issues with request.body line 12 won't throw an error
    const {deviceType, breakingNewsAlerts, weeklySummaryAlerts, expoPushToken} = request.body || {};
    if (!deviceType || typeof breakingNewsAlerts !== 'boolean' || typeof weeklySummaryAlerts !== 'boolean') {
      response.status(400).send("Missing required fields in request body");
      return;
    }
    
    // Insert the device into the devices table, and return the id of the inserted row
    const insertedRows = await db("devices").insert({
      deviceType: deviceType, 
      breakingNewsAlerts: breakingNewsAlerts,
      weeklySummaryAlerts: weeklySummaryAlerts,
      expoPushToken: expoPushToken, // Might be inserted as null (if not provided)
    }).returning("id");

    console.log(insertedRows);

    // Select all from devices table and log result
    const allDevices = await db("devices").select();
    console.log(allDevices);

    response.send({
      deviceId: insertedRows[0].id,
    });
  } catch (error) {
    response.status(500).send("Error: " + error);
  }
});

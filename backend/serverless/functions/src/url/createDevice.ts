import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../../db/dist/data/db-config";
import { v4 as uuidv4 } from "uuid";
import envars from "../envars";
import Joi from "joi";
import tsscmp from "tsscmp";

export const createDevice = onRequest(async (request, response) => {
  const { environment, stagingDbUrl, trustedApiKey } = envars;
  const dbParams = { environment, stagingDbUrl };
  logger.info("dbParams: ", dbParams);
  
  // Get the apiKey from the request headers
  const untrustedApiKey = request.get("X-API-KEY");
  if (!untrustedApiKey) {
    response.status(400).send("No API key provided");
    return;
  }

  // Check if the API key is correct
  if (!tsscmp(untrustedApiKey, trustedApiKey)) {
    response.status(401).send("Unauthorized");
    return;
  }

  logger.info("Creating a new device", { structuredData: true });
  // creates a new device in device table with deviceId, deviceType, breakingNewsAlerts, weeklySummaryAlerts, expoPushToken? (optional)
  // Assume info above is in request body as json. If any required fields are missing, return an error status code

  try {
    // Extract device information from the request body

    // Schema for request body validation
    const schema = Joi.object({
      deviceType: Joi.string().required(),
      expoPushToken: Joi.string().required(),
      "Breaking News": Joi.boolean().required(),
      "Weekly Summary": Joi.boolean().required(),
      "Daily Summary": Joi.boolean().required(),
      isPushEnabled: Joi.boolean().required(),
    });

    // Validate request body
    const { error, value: validBody } = schema.validate(request.body);
    if (error) {
      response.status(400).send("Request body validation error: " + error.message);
      return;
    }


    const deviceType = validBody["deviceType"];
    const expoPushToken = validBody["expoPushToken"];
    const breakingNews = validBody["Breaking News"];
    const weeklySummary = validBody["Weekly Summary"];
    const dailySummary = validBody["Daily Summary"];
    const isPushEnabled = validBody["isPushEnabled"];

    // Check if expoPushToken already exists, if so, update existing row. If not, insert new row
    // Check if the device already exists in the devices table
    const existingDevice = await db(dbParams)("devices")
      .where("expoPushToken", expoPushToken)
      .first();
      // Initialize deviceId
      let deviceId: string; 
    if (existingDevice) {
      // Update the device's settings
      await db(dbParams)("devices")
        .where("expoPushToken", expoPushToken)
        .update({
          deviceType: deviceType,
          "Breaking News": breakingNews,
          "Weekly Summary": weeklySummary,
          "Daily Summary": dailySummary,
          isPushEnabled: isPushEnabled,
        });
        deviceId = existingDevice.id;
    } else {
      // Insert the device into the devices table, and return the id of the inserted row
    const insertedRows = await db(dbParams)("devices")
    .insert({
      id: uuidv4(), // Generate a new UUID for the device
      deviceType: deviceType,
      "Breaking News": breakingNews,
      "Weekly Summary": weeklySummary,
      "Daily Summary": dailySummary,
      isPushEnabled: isPushEnabled,
      expoPushToken: expoPushToken, // Should always exist, even if notifications were denied, but right now it's optional
    })
    .returning("id");
    // TODO: change expo push token to required field
    logger.info("inserted row: ", insertedRows);
    deviceId = insertedRows[0].id;
    }
     // Select all from devices table and log result
     const allDevices = await db(dbParams)("devices").select();
    logger.info(allDevices);
     // Send the device ID back to the client
   response.send({
     deviceId: deviceId,
   });
  } catch (error) {
    console.error("Error creating device:", error);
    response.status(500).send("Error: " + error);
  }
});

import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../../db/dist/data/db-config";
import { defineString } from "firebase-functions/params";
import { slowDown } from 'express-slow-down'

// Create and define a speed limiter (edit values as needed)
const limiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // Allow 5 requests per 15 minutes
  delayMs: (hits) => hits * 100, // Add 100 ms of delay to every request after the 5th one, stacking
});

export const createDevice = onRequest(async (request, response) => {
  // Apply the speed limiter to the function
  limiter(request, response, async () => {
    // Get the API key from the environment variables
    const API_KEY = defineString("APIKEY").value();

    // Get the apiKey from the request headers
    const apiKey = request.headers["X-API-KEY"];

    // Check if the API key is correct
    if (!apiKey || apiKey !== API_KEY) {
      response.status(401).send("Unauthorized")
      return;
    } 

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
});

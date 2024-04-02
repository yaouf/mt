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


export const updateSettings = onRequest(async (request, response) => {
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

      // Our way to identify the device/user to update
      const deviceId = request.body.deviceId; 

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
});

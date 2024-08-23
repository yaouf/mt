import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import Joi from "joi";
import db from "../../../db/dist/data/db-config";
import envars from "../envars";
import { validateApiKey, validateUuidV4 } from "../utils";

export const updateSettings = onRequest(async (request, response) => {
    if (!validateApiKey(request, response)) return;

  const { environment, stagingDbUrl } = envars;
  const dbParams = { environment, stagingDbUrl };


  try {
    logger.info("Updating user settings", { structuredData: true });

    // Request body validation schema
    const schema = Joi.object({
      deviceId: Joi.string().required(),
      "Breaking News": Joi.boolean(),
      "Weekly Summary": Joi.boolean(),
      "Daily Summary": Joi.boolean(),
      isPushEnabled: Joi.boolean(),
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

    // Destructure potential fields from request body
    const breakingNews = validBody["Breaking News"];
    const weeklySummary = validBody["Weekly Summary"];
    const dailySummary = validBody["Daily Summary"];
    const isPushEnabled = validBody["isPushEnabled"];

    // Define the type of updateData
    type UpdateData = {
      "Breaking News"?: boolean;
      "Weekly Summary"?: boolean;
      "Daily Summary"?: boolean;
      "isPushEnabled"?: boolean;
    };
    
    // Construct update object based on what's provided in the request body
    // TODO: make this cleaner
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
    if (isPushEnabled !== undefined) {
      updateData["isPushEnabled"] = isPushEnabled;
    }

    // Get the device ID from the request body
    const deviceId = validBody.deviceId; 

    // First, check if the device exists
    const deviceExists = await db(dbParams)("devices").where("id", deviceId).first();
    if (!deviceExists) {
      // If the device doesn't exist, return an error response
      response.status(404).send("Device not found. Are you sure field \"deviceId\" is correct?");
      return;
    }

    // Update device settings in device table
    const res = await db(dbParams)("devices").where("id", deviceId).update(updateData);
    // log the result of the update
    logger.info(res);
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

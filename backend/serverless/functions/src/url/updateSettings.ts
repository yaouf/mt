import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import Joi from "joi";
import db from "../../../db/dist/data/db-config";
import envars from "../envars";
import { validateApiKey, validateUuidV4 } from "../utils";

/**
 * Updates the settings for a device.
 * Takes a deviceId and an object with the keys "Breaking News", "University News", "Metro", and "isPushEnabled"
 * and their corresponding boolean values to update to.
 * Called when a user changes their push notification settings in the app.
 */
export const updateSettings = onRequest(async (request, response) => {
    if (!validateApiKey(request, response)) return;

  const environment = envars.environment.value();
  const dbUrl = envars.dbUrl.value();
  const dbParams = { environment, dbUrl };


  try {
    logger.info("Updating user settings", { structuredData: true });

    // Request body validation schema
    const schema = Joi.object({
      deviceId: Joi.string().required(),
      "Breaking News": Joi.boolean(),
      "University News": Joi.boolean(),
      "Metro": Joi.boolean(),
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
    const universityNews = validBody["University News"];
    const metro = validBody["Metro"];
    const isPushEnabled = validBody["isPushEnabled"];

    // Define the type of updateData
    type UpdateData = {
      "Breaking News"?: boolean;
      "University News"?: boolean;
      "Metro"?: boolean;
      "isPushEnabled"?: boolean;
    };
    
    // Construct update object based on what's provided in the request body
    // TODO: make this cleaner
    const updateData: UpdateData = {};
    if (breakingNews !== undefined) {
      updateData["Breaking News"] = breakingNews;
    }
    if (universityNews !== undefined) {
      updateData["University News"] = universityNews;
    }
    if (metro !== undefined) {
      updateData["Metro"] = metro;
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

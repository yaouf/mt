import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import Joi from "joi";
import dbFactory from "../../../db/dist/data/db-config";
import { validateApiKey, validateUuidV4 } from "../utils";
/**
 * Gets the settings for a device.
 * Takes a deviceId and returns an object with category preferences and is_push_enabled
 * Called when a user goes to the settings screen in the app.
 */
export const viewSettings = onRequest(async (request, response) => {
  if (!validateApiKey(request, response)) return;
  
  try {
    // Initialize the database connection
    const db = dbFactory({ environment: process.env.ENV || "test" });
    // Schema for request body validation
    const schema = Joi.object({
      deviceId: Joi.string().required(),
    });
    // Validate request body
    const { error, value: validBody } = schema.validate(request.body);
    if (error) {
      logger.error("Request body validation error: " + error.message, {
        requestBody: request.body,
      });
      response
        .status(400)
        .send("Request body validation error: " + error.message);
      return;
    }
    const { deviceId } = validBody;
    // Validate deviceId, make sure its uuid v4
    if (!validateUuidV4(deviceId)) {
      logger.error(
        'Request body validation error: "deviceId" is not a valid UUID v4.',
        { deviceId }
      );
      response
        .status(400)
        .send(
          'Request body validation error: "deviceId" is not a valid UUID v4.'
        );
      return;
    }
    logger.info("Device ID received", { deviceId });

    // Get the device's basic settings
    const device = await db("devices")
      .where("id", deviceId)
      .select("is_push_enabled")
      .first();

    // Check if the device exists
    if (!device) {
      logger.error("Device ID not found.", { deviceId });
      response.status(404).send("Device ID not found.");
      return;
    }

    // Get all categories
    const allCategories = await db("categories").select("id", "name");

    // Get the device's category preferences
    const devicePreferences = await db("device_preferences")
      .where("device_id", deviceId)
      .select("category_id");

    const preferredCategoryIds = new Set(
      devicePreferences.map((pref: { category_id: number }) => pref.category_id)
    );

    // Construct the settings object with all categories and their subscription status
    const categorySettings: Record<string, boolean> = {};

    allCategories.forEach((category: { id: number; name: string }) => {
      categorySettings[category.name] = preferredCategoryIds.has(category.id);
    });

    // Combine with is_push_enabled
    const settings = {
      ...categorySettings,
      isPushEnabled: device.is_push_enabled,
    };

    await db.destroy();

    // Log and send the settings
    logger.info("Device settings sent for deviceId: ", { deviceId, settings });
    response.send(settings);
    return;
  } catch (error) {
    // Make sure to destroy the DB connection even in case of error
    try {
      const db = dbFactory({ environment: process.env.ENV || "test" });
      await db.destroy();
    } catch (destroyError) {
      logger.error("Error destroying DB connection:", destroyError);
    }
    
    logger.error("Error viewing settings", error);
    response.status(500).send("Error viewing settings");
    return;
  }
});

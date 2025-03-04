import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import Joi from "joi";
import { Knex } from "knex";
import db from "../../../db/dist/data/db-config";
import envars from "../envars";
import { validateApiKey, validateUuidV4 } from "../utils";

/**
 * Updates the settings for a device.
 * Takes a deviceId and an object with category preferences and isPushEnabled
 * and their corresponding boolean values to update to.
 * Called when a user changes their push notification settings in the app.
 */
export const updateSettings = onRequest(async (request, response) => {
  if (!validateApiKey(request, response)) return;

  const environment = envars.environment.value();
  const dbUrl = envars.dbUrl.value();
  const dbParams = { environment, dbUrl };

  const newDb = db(dbParams);

  try {
    logger.info(
      "Updating user settings",
      { structuredData: true },
      request.body
    );

    // Request body validation schema
    const schema = Joi.object({
      deviceId: Joi.string().required(),
      "Breaking News": Joi.boolean().optional(),
      "University News": Joi.boolean().optional(),
      Metro: Joi.boolean().optional(),
      Opinions: Joi.boolean().optional(),
      "Arts and Culture": Joi.boolean().optional(),
      Sports: Joi.boolean().optional(),
      "Science and Research": Joi.boolean().optional(),
      isPushEnabled: Joi.boolean().optional(),
    });

    // Validate request body
    const { error, value: validBody } = schema.validate(request.body);
    if (error) {
      logger.error("Request body validation error: " + error.message);
      response
        .status(400)
        .send("Request body validation error: " + error.message);
      return;
    }

    // Validate deviceId, make sure its uuid v4
    if (!validateUuidV4(validBody.deviceId)) {
      logger.error(
        'Request body validation error: "deviceId" is not a valid UUID v4.'
      );
      response
        .status(400)
        .send(
          'Request body validation error: "deviceId" is not a valid UUID v4.'
        );
      return;
    }

    // Destructure potential fields from request body
    const breakingNews = validBody["Breaking News"];
    const universityNews = validBody["University News"];
    const metro = validBody["Metro"];
    const opinions = validBody["Opinions"];
    const artsAndCulture = validBody["Arts and Culture"];
    const sports = validBody["Sports"];
    const scienceAndResearch = validBody["Science and Research"];
    const isPushEnabled = validBody["isPushEnabled"];

    // Get the device ID from the request body
    const deviceId = validBody.deviceId;

    // First, check if the device exists
    const deviceExists = await newDb("devices").where("id", deviceId).first();
    if (!deviceExists) {
      // If the device doesn't exist, return an error response
      logger.error(
        'Device not found. Are you sure field "deviceId" is correct?',
        { deviceId }
      );
      response
        .status(404)
        .send('Device not found. Are you sure field "deviceId" is correct?');
      return;
    }

    // Get all category IDs for later use
    const categories = await newDb("categories").select("id", "name");
    const categoryMap = new Map(
      categories.map((cat: { id: number; name: string }) => [cat.name, cat.id])
    );

    // Begin transaction to ensure all updates are atomic
    await newDb.transaction(async (trx: Knex.Transaction) => {
      // Update is_push_enabled if provided
      if (isPushEnabled !== undefined) {
        await trx("devices")
          .where("id", deviceId)
          .update({ is_push_enabled: isPushEnabled });
      }

      // Handle category preferences updates
      const categoryUpdates = [
        { name: "Breaking News", value: breakingNews },
        { name: "University News", value: universityNews },
        { name: "Metro", value: metro },
        { name: "Opinions", value: opinions },
        { name: "Arts and Culture", value: artsAndCulture },
        { name: "Sports", value: sports },
        { name: "Science and Research", value: scienceAndResearch },
      ];

      // Get current preferences
      const currentPreferences = await trx("device_preferences")
        .where("device_id", deviceId)
        .join("categories", "device_preferences.category_id", "categories.id")
        .select("categories.name", "categories.id");

      const currentPreferenceMap = new Map(
        currentPreferences.map((pref: { name: string; id: number }) => [
          pref.name,
          pref.id,
        ])
      );

      // Process each category update
      for (const update of categoryUpdates) {
        if (update.value === undefined) continue;

        const categoryId = categoryMap.get(update.name);
        if (!categoryId) continue;

        const hasPreference = currentPreferenceMap.has(update.name);

        if (update.value && !hasPreference) {
          // Add preference
          await trx("device_preferences").insert({
            device_id: deviceId,
            category_id: categoryId,
          });
        } else if (!update.value && hasPreference) {
          // Remove preference
          await trx("device_preferences")
            .where({
              device_id: deviceId,
              category_id: categoryId,
            })
            .delete();
        }
      }
    });

    await newDb.destroy();

    // Log the result of update
    logger.info("Device settings updated for deviceId: ", {
      deviceId,
      updates: {
        "Breaking News": breakingNews,
        "University News": universityNews,
        Metro: metro,
        Opinions: opinions,
        "Arts and Culture": artsAndCulture,
        Sports: sports,
        "Science and Research": scienceAndResearch,
        is_push_enabled: isPushEnabled,
      },
    });

    response.send("Settings updated!");
    return;
  } catch (error) {
    logger.error("Error updating settings", error);
    response.status(500).send("Error updating settings");
    return;
  }
});

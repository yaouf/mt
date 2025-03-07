import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import db from "../../../db/dist/data/db-config";
import { validateApiKey } from "../utils";

export const createDevice = onRequest(async (request, response) => {
  if (!validateApiKey(request, response)) return;

  logger.info(
    "createDevice was called with the following request body: ",
    { structuredData: true },
    request.body
  );
  // creates a new device in device table with deviceId, device_type, and category preferences
  // Assume info above is in request body as json. If any required fields are missing, return an error status code

  try {
    // Extract device information from the request body

    // Schema for request body validation
    const schema = Joi.object({
      deviceType: Joi.string().required(),
      expoPushToken: Joi.string().required(),
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
      logger.error("Request body validation error: " + error.message, {
        requestBody: request.body,
      });
      response
        .status(400)
        .send("Request body validation error: " + error.message);
      return;
    }

    const deviceType = validBody["deviceType"];
    const expoPushToken = validBody["expoPushToken"];
    const breakingNews = validBody["Breaking News"];
    const universityNews = validBody["University News"];
    const metro = validBody["Metro"];
    const opinions = validBody["Opinions"];
    const artsAndCulture = validBody["Arts and Culture"];
    const sports = validBody["Sports"];
    const scienceAndResearch = validBody["Science and Research"];
    const isPushEnabled = validBody["isPushEnabled"];

    // Check if expoPushToken already exists, if so, update existing row. If not, insert new row
    // Check if the device already exists in the devices table
    const existingDevice = await db("devices")
      .where("expo_push_token", expoPushToken)
      .first();

    // Initialize deviceId
    let deviceId: string;

    // Get all category IDs for later use
    const categories = await db("categories").select("id", "name");
    const categoryMap = new Map(
      categories.map((cat: { id: number; name: string }) => [cat.name, cat.id])
    );

    if (existingDevice) {
      // Update the device's basic settings
      await db("devices")
        .where("expo_push_token", expoPushToken)
        .update({
          device_type: deviceType,
          is_push_enabled:
            isPushEnabled !== undefined
              ? isPushEnabled
              : existingDevice.is_push_enabled,
        });

      deviceId = existingDevice.id;

      // Update category preferences by first removing all existing preferences
      await db("device_preferences").where("device_id", deviceId).delete();

      // Then insert new preferences based on the provided values
      const preferencesToInsert = [];

      if (
        breakingNews !== undefined &&
        breakingNews &&
        categoryMap.has("Breaking News")
      ) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("Breaking News"),
        });
      }

      if (
        universityNews !== undefined &&
        universityNews &&
        categoryMap.has("University News")
      ) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("University News"),
        });
      }

      if (metro !== undefined && metro && categoryMap.has("Metro")) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("Metro"),
        });
      }

      if (opinions !== undefined && opinions && categoryMap.has("Opinions")) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("Opinions"),
        });
      }

      if (
        artsAndCulture !== undefined &&
        artsAndCulture &&
        categoryMap.has("Arts and Culture")
      ) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("Arts and Culture"),
        });
      }

      if (sports !== undefined && sports && categoryMap.has("Sports")) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("Sports"),
        });
      }

      if (
        scienceAndResearch !== undefined &&
        scienceAndResearch &&
        categoryMap.has("Science and Research")
      ) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("Science and Research"),
        });
      }

      // Insert new preferences if there are any
      if (preferencesToInsert.length > 0) {
        await db("device_preferences").insert(preferencesToInsert);
      }

      logger.info(
        "CreateDevice was called but device already exists. Device updated for deviceId: ",
        {
          deviceId,
          updates: {
            device_type: deviceType,
            "Breaking News": breakingNews,
            "University News": universityNews,
            Metro: metro,
            Opinions: opinions,
            "Arts and Culture": artsAndCulture,
            Sports: sports,
            "Science and Research": scienceAndResearch,
            is_push_enabled: isPushEnabled,
          },
        }
      );
    } else {
      const dateCreated = new Date();
      // Insert the device into the devices table, and return the id of the inserted row
      deviceId = uuidv4(); // Generate a new UUID for the device

      await db("devices").insert({
        id: deviceId,
        device_type: deviceType,
        is_push_enabled: isPushEnabled ?? false,
        expo_push_token: expoPushToken,
        date_created: dateCreated,
      });

      // Insert category preferences
      const preferencesToInsert = [];

      if (breakingNews && categoryMap.has("Breaking News")) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("Breaking News"),
        });
      }

      if (universityNews && categoryMap.has("University News")) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("University News"),
        });
      }

      if (metro && categoryMap.has("Metro")) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("Metro"),
        });
      }

      if (opinions && categoryMap.has("Opinions")) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("Opinions"),
        });
      }

      if (artsAndCulture && categoryMap.has("Arts and Culture")) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("Arts and Culture"),
        });
      }

      if (sports && categoryMap.has("Sports")) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("Sports"),
        });
      }

      if (scienceAndResearch && categoryMap.has("Science and Research")) {
        preferencesToInsert.push({
          device_id: deviceId,
          category_id: categoryMap.get("Science and Research"),
        });
      }

      // Insert new preferences if there are any
      if (preferencesToInsert.length > 0) {
        await db("device_preferences").insert(preferencesToInsert);
      }

      logger.info(
        "Device created. Inserted deviceId: ",
        deviceId,
        " with the following settings: ",
        {
          device_type: deviceType,
          "Breaking News": breakingNews,
          "University News": universityNews,
          Metro: metro,
          Opinions: opinions,
          "Arts and Culture": artsAndCulture,
          Sports: sports,
          "Science and Research": scienceAndResearch,
          is_push_enabled: isPushEnabled,
          date_created: dateCreated,
        }
      );
    }

    // Send the device ID back to the client
    response.send({
      deviceId: deviceId,
    });
  } catch (error) {
    console.error("Error creating device:", error);
    response.status(500).send("Error: " + error);
  }
});

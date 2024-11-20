import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import db from "../../../db/dist/data/db-config";
import envars from "../envars";
import { validateApiKey } from "../utils";

export const createDevice = onRequest(async (request, response) => {
  if (!validateApiKey(request, response)) return;

  const environment = envars.environment.value();
  const dbUrl = envars.dbUrl.value();
  const dbParams = { environment, dbUrl };
  const newDb = db(dbParams);
  logger.info("dbParams: ", dbParams);

  logger.info(
    "createDevice was called with the following request body: ",
    { structuredData: true },
    request.body
  );
  // creates a new device in device table with deviceId, deviceType, breakingNewsAlerts, universityNewsAlerts, expoPushToken? (optional)
  // Assume info above is in request body as json. If any required fields are missing, return an error status code

  try {
    // Extract device information from the request body

    // Schema for request body validation
    // TODO: factor out schema and repetitive fields into a single object
    const schema = Joi.object({
      deviceType: Joi.string().required(),
      expoPushToken: Joi.string().required(),
<<<<<<< HEAD
      "Breaking News": Joi.boolean().required(),
      "University News": Joi.boolean().required(),
      "Metro": Joi.boolean().required(),
      "Opinions": Joi.boolean().required(),
      "Arts and Culture": Joi.boolean().required(),
      "Sports": Joi.boolean().required(),
      "Science and Research": Joi.boolean().required(),
      isPushEnabled: Joi.boolean().required(),
=======
      "Breaking News": Joi.boolean().optional(),
      "University News": Joi.boolean().optional(),
      Metro: Joi.boolean().optional(),
      Opinions: Joi.boolean().optional(),
      "Arts and Culture": Joi.boolean().optional(),
      Sports: Joi.boolean().optional(),
      "Science and Research": Joi.boolean().optional(),
      isPushEnabled: Joi.boolean().optional(),
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
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
    const existingDevice = await newDb("devices")
      .where("expoPushToken", expoPushToken)
      .first();
    // Initialize deviceId
    let deviceId: string;
    if (existingDevice) {
      const updateFields: Record<string, any> = {
        deviceType,
        "Breaking News": breakingNews,
        "University News": universityNews,
        Metro: metro,
        Opinions: opinions,
        "Arts and Culture": artsAndCulture,
        Sports: sports,
        "Science and Research": scienceAndResearch,
        isPushEnabled,
      };

      const filteredUpdateFields = Object.fromEntries(
        Object.entries(updateFields).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );

      // Update the device's settings
      await newDb("devices")
        .where("expoPushToken", expoPushToken)
<<<<<<< HEAD
        .update({
          deviceType: deviceType,
          "Breaking News": breakingNews,
          "University News": universityNews,
          "Metro": metro,
          "Opinions": opinions,
          "Arts and Culture": artsAndCulture,
          "Sports": sports,
          "Science and Research": scienceAndResearch,
          isPushEnabled: isPushEnabled,
        });
        deviceId = existingDevice.id;
        // TODO: refactor this into a single object
        logger.info("CreateDevice was called but device already exists. Device updated for deviceId: ", { deviceId, updates: {
          deviceType: deviceType,
          "Breaking News": breakingNews,
          "University News": universityNews,
          "Metro": metro,
          "Opinions": opinions,
          "Arts and Culture": artsAndCulture,
          "Sports": sports,
          "Science and Research": scienceAndResearch,
          isPushEnabled: isPushEnabled,
        } });
    } else {
      // Insert the device into the devices table, and return the id of the inserted row
    const insertedRows = await newDb("devices")
    .insert({
      id: uuidv4(), // Generate a new UUID for the device
      deviceType: deviceType,
      "Breaking News": breakingNews,
      "University News": universityNews,
      "Metro": metro,
      "Opinions": opinions,
      "Arts and Culture": artsAndCulture,
      "Sports": sports,
      "Science and Research": scienceAndResearch,
      isPushEnabled: isPushEnabled,
      expoPushToken: expoPushToken, // Should always exist, even if notifications were denied, but right now it's optional
    })
    .returning("id");

    await newDb.destroy();
    // TODO: change expo push token to required field
    // logger.info("inserted row: ", insertedRows);
    deviceId = insertedRows[0].id;
    // TODO: structure logs so I can filter by function name in logger
    logger.info("Device created. Inserted deviceId: ", deviceId, " with the following settings: ", {
      deviceType: deviceType,
      "Breaking News": breakingNews,
      "University News": universityNews,
      "Metro": metro,
      "Opinions": opinions,
      "Arts and Culture": artsAndCulture,
      "Sports": sports,
      "Science and Research": scienceAndResearch,
      isPushEnabled: isPushEnabled,
    });
=======
        .update(filteredUpdateFields);
      deviceId = existingDevice.id;
      // TODO: refactor this into a single object
      logger.info(
        "CreateDevice was called but device already exists. Device updated for deviceId: ",
        {
          deviceId,
          updates: {
            deviceType: deviceType,
            "Breaking News": breakingNews,
            "University News": universityNews,
            Metro: metro,
            Opinions: opinions,
            "Arts and Culture": artsAndCulture,
            Sports: sports,
            "Science and Research": scienceAndResearch,
            isPushEnabled: isPushEnabled,
          },
        }
      );
    } else {
      // Insert the device into the devices table, and return the id of the inserted row
      const insertedRows = await newDb("devices")
        .insert({
          id: uuidv4(), // Generate a new UUID for the device
          deviceType: deviceType,
          "Breaking News": breakingNews ?? false,
          "University News": universityNews ?? false,
          Metro: metro ?? false,
          Opinions: opinions ?? false,
          "Arts and Culture": artsAndCulture ?? false,
          Sports: sports ?? false,
          "Science and Research": scienceAndResearch ?? false,
          isPushEnabled: isPushEnabled ?? false,
          expoPushToken: expoPushToken, // Should always exist, even if notifications were denied, but right now it's optional
        })
        .returning("id");

      await newDb.destroy();
      // TODO: change expo push token to required field
      // logger.info("inserted row: ", insertedRows);
      deviceId = insertedRows[0].id;
      // TODO: structure logs so I can filter by function name in logger
      logger.info(
        "Device created. Inserted deviceId: ",
        deviceId,
        " with the following settings: ",
        {
          deviceType: deviceType,
          "Breaking News": breakingNews,
          "University News": universityNews,
          Metro: metro,
          Opinions: opinions,
          "Arts and Culture": artsAndCulture,
          Sports: sports,
          "Science and Research": scienceAndResearch,
          isPushEnabled: isPushEnabled,
        }
      );
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
    }
    // Select all from devices table and log result
    //  const allDevices = await db(dbParams)("devices").select();
    // logger.info(allDevices);
<<<<<<< HEAD
     // Send the device ID back to the client
   response.send({
     deviceId: deviceId,
   });
=======
    // Send the device ID back to the client
    response.send({
      deviceId: deviceId,
    });
>>>>>>> e481223bbba4271bc6fd087b618c40700b3d6db4
  } catch (error) {
    console.error("Error creating device:", error);
    response.status(500).send("Error: " + error);
  }
});

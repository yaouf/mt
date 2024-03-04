import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../../../db/data/db-config";

export const createDevice = onRequest(async (request, response) => {
  logger.info("Creating a new device", { structuredData: true });
  // TODO CHRISTIAN: create a new device in device table with deviceId, deviceType, breakingNewsAlerts, weeklySummaryAlerts, expoPushToken? (optional)
  // Assume info above is in request body as json. If any required fields are missing, return an error status code
  const insertedRows = await db("devices").insert({
    deviceType: "Android",
    breakingNewsAlerts: true,
    weeklySummaryAlerts: false,
    expoPushToken: "ExpoPushToken[124]",
  });

  console.log(insertedRows);

  // select all from devices table and log result
  const allDevices = await db("devices").select();
  console.log(allDevices);

  response.send("Device created!");
});

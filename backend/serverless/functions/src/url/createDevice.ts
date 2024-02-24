import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import db from "../../data/db-config";

export const createDevice = onRequest(async (request, response) => {
  logger.info("Creating a new device", { structuredData: true });
  // TODO CHRISTIAN: create a new device in device table with deviceId, deviceType, breakingNewsAlerts, weeklySummaryAlerts, expoPushToken?
//   const db = knex(config.development);

//   await db.schema.createTable("devices", table => {
//     table.increments("id").primary(); 
//     table.integer("deviceId").unique().notNullable(); 
//     table.string("deviceType").notNullable();
//     table.boolean("breakingNewsAlerts").notNullable();
//     table.boolean("weeklySummaryAlerts").notNullable();
//     table.string("expoPushToken").unique(); 
//   });

  const insertedRows = await db("devices").insert({
    deviceType: "Phone",
    breakingNewsAlerts: true,
    weeklySummaryAlerts: false,
    expoPushToken: "ExpoToken[124]",
  });

  console.log(insertedRows);

  // select all from devices table and log result
  const allDevices = await db("devices").select();
  console.log(allDevices);

  

  response.send("Device created!");
});

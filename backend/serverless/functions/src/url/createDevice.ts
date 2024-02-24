import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";
import knex from "knex";

export const createDevice = onRequest(async (request, response) => {
  logger.info("Creating a new device", { structuredData: true });
  // TODO: create a new device in device table with deviceId, deviceType, breakingNewsAlerts, weeklySummaryAlerts, expoPushToken?
  const db = knex({
    client: "sqlite3",
    connection: {
      filename: "../data.db",
    },
    useNullAsDefault: true,
  });

  await db.schema.createTable("devices", table => {
    table.increments("id").primary(); 
    table.integer("deviceId").unique().notNullable(); 
    table.string("deviceType").notNullable();
    table.boolean("breakingNewsAlerts").notNullable();
    table.boolean("weeklySummaryAlerts").notNullable();
    table.string("expoPushToken").unique(); 
  });

  const insertedRows = await db("devices").insert({
    deviceId: 2,
    deviceType: "Phone",
    breakingNewsAlerts: true,
    weeklySummaryAlerts: false,
    expoPushToken: "ExpoToken123",
  });

  console.log(insertedRows);

  // select all from devices table and log result
  const allDevices = await db("devices").select();
  console.log(allDevices);

  

  response.send("Device created!");
});

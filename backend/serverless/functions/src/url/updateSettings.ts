import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

export const updateSettings = onRequest((request, response) => {
  logger.info("Updating user settings", { structuredData: true });
  // TODO: update device settings in device table with new breakingNewsAlerts, weeklySummaryAlerts
    
  response.send("Settings updated!");
});

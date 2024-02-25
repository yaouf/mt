import * as logger from "firebase-functions/logger";
import { onRequest } from "firebase-functions/v2/https";

export const updateSettings = onRequest((request, response) => {
  logger.info("Updating user settings", { structuredData: true });
  // TODO CHRISTIAN: update device settings in device table with new breakingNewsAlerts, weeklySummaryAlerts
    // Assume request body is { breakingNewsAlerts: true, weeklySummaryAlerts: false } or subset of these fields
    // and if it is not, return an error status code
  response.send("Settings updated!");
});

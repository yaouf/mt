import Bull from "bull";
import db from "../../dist/data/db-config";
import { Device, Notification } from "../types/types";
import Expo, { ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
// Connect to a local Redis instance. For production, configure the connection accordingly.
const notificationQueue = new Bull(
  "notificationQueue",
  "redis://127.0.0.1:6379"
);



// send notifications to corresponding devices
notificationQueue.process(async (job) => {
  // This is the job data that was passed to `notificationQueue.add()`
  const { title, body, tags } = job.data as Notification;

  // Fetch all devices that have subscribed to the tags
  let devices: Device[] = [];

  if (tags.includes("breaking-news")) {
    // Fetch all devices that have subscribed to breaking news alerts
    const breakingDevices = await db("devices").select("expoPushToken").where("breakingNewsAlerts", true) as Device[];
    devices = devices.concat(breakingDevices);
  } 
  if (tags.includes("weekly-summary")) {
    // Fetch all devices that have subscribed to weekly summary alerts
    const weeklyDevices = await db("devices").select("expoPushToken").where("weeklySummaryAlerts", true) as Device[];
    devices = devices.concat(weeklyDevices);
  }
  if (tags.includes("daily-summary")) {
    // Fetch all devices that have subscribed to daily summary alerts
    const dailyDevices = await db("devices").select("expoPushToken").where("dailySummaryAlerts", true);
    devices = devices.concat(dailyDevices) as Device[];
  }

  // Send notifications to all devices
  for (const device of devices) {
    // Send the notification to the device
    console.log(`Sending notification to ${device.expoPushToken}`);

    // Notifcation sending

    // Initialize a new Expo SDK client with the provided access token
    const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

    // Extract the Expo push tokens from the devices
    const somePushTokens: string[] = devices.map(
      device => device.expoPushToken
    );

    // Create the messages that you want to send to clients
    const messages: ExpoPushMessage[] = [];
    for (const pushToken of somePushTokens) {
      // Validate the push token to ensure it's a valid Expo push token
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      // Construct a push notification message for each valid push token
      messages.push({
        to: pushToken,
        sound: "default",
        title: title,
        body: body,
      });
    }

    // The Expo push notification service accepts batches of notifications so
    // we use `chunkPushNotifications` to divide the array of messages into chunks
    const chunks = expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    // Send the chunks to the Expo push notification service
    (async () => {
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();

    // Create an array to store the receipt IDs for each notification
    let receiptIds: string[] = [];
    for (let ticket of tickets) {
      if (ticket && "id" in ticket) {
        receiptIds.push(ticket.id);
      }
    }

    // Divide the receipt IDs into chunks
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

    // Retrieve the receipts for each chunk of receipt IDs
    (async () => {
      for (let chunk of receiptIdChunks) {
        try {
          let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
          console.log(receipts);

          // Handle the receipts to determine if the notifications were successfully sent
          for (let receiptId in receipts) {
            let { status, details } = receipts[receiptId];
            if (status === "ok") {
              continue;
            } else if (status === "error") {
              console.error(`There was an error sending a notification:`);
              if (details && "error" in details) {
                console.error(`The error code is ${details.error}`);
              }
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }




});

export default notificationQueue;

import { Job, Queue, Worker } from "bullmq";
import Expo, { ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
import db from "../../../dist/data/db-config";
import { DeviceToken } from "../types/types";

const connection = {
  host: "localhost",
  port: 6379,
};

// Connect to a local Redis instance. For production, configure the connection accordingly.
const notificationQueue = new Queue("notificationQueue", {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: {
      count: 5,
    },
  },
});
console.log("connected to queue");

notificationQueue.setGlobalConcurrency(1);

// Handle failures.

// Send notifications to corresponding devices
const worker = new Worker(
  "notificationQueue",
  async (job) => {
    // This is the job data that was passed to `notificationQueue.add()`
    const { time, title, body, tags, url, isUid, notificationId, authorIds } = job.data;
    // Fetch all devices that have subscribed to the tags
    let expoPushTokens: Set<string> = new Set(); // Use a map with push token as key
    
    // Get devices subscribed to specific tags
    for (let tag of tags) {
      const devices = (await db("devices")
        .select("devices.expo_push_token")
        .join(
          "device_preferences",
          "devices.id",
          "device_preferences.device_id"
        )
        .join("categories", "device_preferences.category_id", "categories.id")
        .where("categories.name", tag)) as DeviceToken[];
      for (let device of devices) {
        expoPushTokens.add(device.expo_push_token);
      }
    }
    
    // Get devices subscribed to specific authors (if any)
    if (authorIds && authorIds.length > 0) {
      for (let authorId of authorIds) {
        const devices = (await db("devices")
          .select("devices.expo_push_token")
          .join(
            "device_author_subscriptions",
            "devices.id",
            "device_author_subscriptions.deviceId"
          )
          .where("device_author_subscriptions.authorId", authorId)) as DeviceToken[];
        for (let device of devices) {
          expoPushTokens.add(device.expo_push_token);
        }
      }
    }

    const tokensArray = Array.from(expoPushTokens);
    // Send notifications to all devices
    tokensArray.forEach((token) => {
      // Send the notification to the device
      // console.log(`Sending notification to ${device.expoPushToken}`);

      // Notifcation sending

      // Initialize a new Expo SDK client with the provided access token
      const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

      // Extract the Expo push tokens from the devices

      // const somePushTokens: string[] = [device.expoPushToken]

      // Create the messages that you want to send to clients
      const pushToken = token;
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        return;
      }

      // Construct a push notification message for each valid push token

      const messages: ExpoPushMessage[] = [];
      messages.push({
        to: pushToken,
        sound: "default",
        title: title,
        body: body,
        data: { url, isUid },
      });

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
            // console.log(receipts);

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
    });

    // Update notification status to "sent" in the database
    try {
      console.log("notificationId", notificationId);
      await db("notifications")
        .where({ id: notificationId })
        .update({ status: "sent" });
      console.log(
        `Notification with ID ${notificationId} at time ${time} successfully updated to status "sent"`
      );
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  },
  { connection }
);

worker.on("failed", (job: Job, error: Error) => {
  // Do something with the return value.
  console.error("job with data : ", job.data, " failed with error: ", error);
});

worker.on("error", (err) => {
  // log the error
  console.error("worker failed with error", err);
});

export { notificationQueue, worker };

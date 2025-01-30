import { Job, Queue, Worker } from "bullmq";
import Expo, { ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
import db from "../../../dist/data/db-config";
import { Device } from "../types/types";

const connection = {
  host: "localhost",
  port: 6379
};

// Connect to a local Redis instance. For production, configure the connection accordingly.
const notificationQueue = new Queue(
  "notificationQueue",
  {
    connection,
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: {
        count: 5
      }
    }
  }
);
console.log('connected to queue');

notificationQueue.setGlobalConcurrency(1);


// Handle failures. 

// Send notifications to corresponding devices
const worker = new Worker("notificationQueue", async (job) => {
  // This is the job data that was passed to `notificationQueue.add()`
  const { jobId, time, title, body, tags, url, isUid } = job.data;
  console.log("tags", tags);
  // Fetch all devices that have subscribed to the tags
  let deviceMap = new Map<string, Device>(); // Use a map with push token as key
  for (let tag of tags) {
    console.log("tag", tag);
    const devices = (await db("devices")
      .select("expo_push_token")
      .where(tag, true)) as Device[];
    for (let device of devices) {
      deviceMap.set(device.expoPushToken, device);
    }
  }

  const devices = Array.from(deviceMap.values());
  // console.log("devices", devices);
  // if (tags.includes("breaking-news")) {
  //   // Fetch all devices that have subscribed to breaking news alerts
  //   const breakingDevices = await db("devices").select("expoPushToken").where("breakingNewsAlerts", true) as Device[];
  //   devices = devices.concat(breakingDevices);
  // }
  // if (tags.includes("University News")) {
  //   // Fetch all devices that have subscribed to universityNews summary alerts
  //   const universityNewsDevices = await db("devices").select("expoPushToken").where("universityNewsAlerts", true) as Device[];
  //   devices = devices.concat(universityNewsDevices);
  // }
  // if (tags.includes("Metro")) {
  //   // Fetch all devices that have subscribed to daily summary alerts
  //   const dailyDevices = await db("devices").select("expoPushToken").where("metroAlerts", true);
  //   devices = devices.concat(dailyDevices) as Device[];
  // }

  // Send notifications to all devices
  devices.forEach((device) => {
    // Send the notification to the device
    // console.log(`Sending notification to ${device.expoPushToken}`);

    // Notifcation sending

    // Initialize a new Expo SDK client with the provided access token
    const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

    // Extract the Expo push tokens from the devices

    // const somePushTokens: string[] = [device.expoPushToken]

    // Create the messages that you want to send to clients
    const pushToken = device.expoPushToken;
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
    await db("notifications").where({ id: jobId }).update({ status: "sent" });
    console.log(
      `Notification with ID ${jobId} at time ${time} successfully updated to status "sent"`
    );
  } catch (error) {
    console.error("Error updating notification status:", error);
  }

  // Update notification status to "sent" in the database
  try {
    await db("notifications").where({ id: jobId }).update({ status: "sent" });
    console.log(
      `Notification with ID ${jobId} at time ${time} successfully updated to status "sent"`
    );
  } catch (error) {
    console.error("Error updating notification status:", error);
  }
}, { connection });

worker.on('failed', (job: Job, error: Error) => {
  // Do something with the return value.
  console.error("job with data : ", job.data, " failed with error: ", error);
});

worker.on('error', err => {
  // log the error
  console.error("worker failed with error", err);
});

export { notificationQueue, worker };


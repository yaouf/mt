import { Job, Queue, Worker } from 'bullmq';
import Expo, { ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import db from '../../../dist/data/db-config';
import { DeviceToken } from '../types/types';

const connection = {
  host: 'localhost',
  port: 6379,
};

/**
 * Creates a queue for managing notifications.
 * This queue processes jobs related to sending push notifications.
 * 
 * For production, the Redis connection should be configured accordingly.
 */
const notificationQueue = new Queue('notificationQueue', {
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: {
      count: 5,
    },
  },
});
console.log('connected to queue');

// Set global concurrency for the worker
notificationQueue.setGlobalConcurrency(1);

/**
 * Worker for processing notification jobs.
 * This worker listens for jobs in the 'notificationQueue' and sends push notifications to devices based on the data in the job.
 */
const worker = new Worker(
  'notificationQueue',
  async (job) => {
    // Destructure the job data
    const { time, title, body, tags, url, isUid, notificationId } = job.data;

    // Set to store unique Expo push tokens
    let expoPushTokens: Set<string> = new Set();

    // Fetch devices that have subscribed to the tags associated with the notification
    for (let tag of tags) {
      const devices = (await db('devices')
        .select('devices.expo_push_token')
        .join('device_preferences', 'devices.id', 'device_preferences.device_id')
        .join('categories', 'device_preferences.category_id', 'categories.id')
        .where('categories.name', tag)) as DeviceToken[];

      // Add push tokens to the set
      for (let device of devices) {
        expoPushTokens.add(device.expo_push_token);
      }
    }

    // Convert the set of tokens to an array for further processing
    const tokensArray = Array.from(expoPushTokens);

    // Initialize Expo SDK for sending push notifications
    const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

    // Loop over each device token and send a notification
    tokensArray.forEach((token) => {
      if (!Expo.isExpoPushToken(token)) {
        console.error(`Push token ${token} is not a valid Expo push token`);
        return;
      }

      // Prepare the push notification message
      const messages: ExpoPushMessage[] = [{
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: { url, isUid },
      }];

      // Chunk the messages before sending (Expo's API limits the number of messages per request)
      const chunks = expo.chunkPushNotifications(messages);
      const tickets: ExpoPushTicket[] = [];

      // Send the push notification chunks to Expo service
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

      // Collect the receipt IDs from the tickets
      let receiptIds: string[] = [];
      for (let ticket of tickets) {
        if (ticket && 'id' in ticket) {
          receiptIds.push(ticket.id);
        }
      }

      // Divide receipt IDs into chunks for querying receipt status
      let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

      // Fetch receipt statuses and handle any errors
      (async () => {
        for (let chunk of receiptIdChunks) {
          try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            for (let receiptId in receipts) {
              let { status, details } = receipts[receiptId];
              if (status === 'ok') {
                continue;
              } else if (status === 'error') {
                console.error(`Error sending notification: ${details?.error}`);
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      })();
    });

    // Update notification status in the database once the notification is sent
    try {
      await db('notifications').where({ id: notificationId }).update({ status: 'sent' });
      console.log(`Notification with ID ${notificationId} successfully updated to status "sent"`);
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  },
  { connection }
);

// Handle job failures
worker.on('failed', (job: Job, error: Error) => {
  console.error('Job failed with error:', error);
  console.error('Job data:', job.data);
});

// Handle worker errors
worker.on('error', (err) => {
  console.error('Worker failed with error:', err);
});

// Export the queue and worker for external usage
export { notificationQueue, worker };

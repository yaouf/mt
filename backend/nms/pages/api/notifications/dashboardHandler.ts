import type { NextApiRequest, NextApiResponse } from "next";
import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
import db from "../../../db/data/db-config";

type ResponseData = {
  message: string;
};

export default async function dashboardHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Create a new Expo SDK client
  // optionally providing an access token if you have enabled push security
  // TODO: enable push security
  // TODO YASSIR: query sql server for push token list for a category

  // select all from devices table and log result
  const allDevices = await db("devices").select();
  console.log(allDevices);

  const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  const somePushTokens: string[] = [
    "ExponentPushToken[98FnGADJ4AOEqyomeGRsRR]",
  ];
  // Create the messages that you want to send to clients
  const messages: ExpoPushMessage[] = [];
  for (const pushToken of somePushTokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: pushToken,
      sound: "default",
      body: "This is a test notification",
      data: { withSome: "data" },
    });
  }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  const chunks = expo.chunkPushNotifications(messages);
  const tickets: ExpoPushTicket[] = [];
  (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        console.error(error);
      }
    }
  })();

  // Later, after the Expo push notification service has delivered the
  // notifications to Apple or Google (usually quickly, but allow the the service
  // up to 30 minutes when under load), a "receipt" for each notification is
  // created. The receipts will be available for at least a day; stale receipts
  // are deleted.
  //
  // The ID of each receipt is sent back in the response "ticket" for each
  // notification. In summary, sending a notification produces a ticket, which
  // contains a receipt ID you later use to get the receipt.
  //
  // The receipts may contain error codes to which you must respond. In
  // particular, Apple or Google may block apps that continue to send
  // notifications to devices that have blocked notifications or have uninstalled
  // your app. Expo does not control this policy and sends back the feedback from
  // Apple and Google so you can handle it appropriately.

  // let receiptIds = [];
  // for (let ticket of tickets) {
  //   // NOTE: Not all tickets have IDs; for example, tickets for notifications
  //   // that could not be enqueued will
  //  have error information and no receipt ID.
  //   if (ticket.id) {
  //     receiptIds.push(ticket.id);
  //   }
  // }

  // let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  // (async () => {
  //   // Like sending notifications, there are different strategies you could use
  //   // to retrieve batches of receipts from the Expo service.
  //   for (let chunk of receiptIdChunks) {
  //     try {
  //       let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
  //       console.log(receipts);

  //       // The receipts specify whether A
  // // pple or Google successfully received the
  //       // notification and information about an error, if one occurred.
  //       for (let receiptId in receipts) {
  //         let { status, message, details } = receipts[receiptId];
  //         if (status === 'ok') {
  //           continue;
  //         } else if (status === 'error') {
  //           console.error(
  //             `There was an error sending a notification: ${message}`
  //           );
  //           if (details && details.error) {
  //             // The error codes are listed in the Expo documentation:
  //             // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
  //             // You must handle the errors appropriately.
  //             console.error(`The error code is ${details.error}`);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // })();
  res
    .status(200)
    .json({ message: "Edit this file to schedule notifications!" });
}


export async function breakingHandler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  // Ensure that the request type is for breaking news alerts
  if (!req.body.tags.includes("breaking")) {
    return res.status(400).json({ message: "Invalid request type" });
  }

  // Query the database for all devices that have enabled breaking news alerts
  const allDevices = await db("devices").select('expoPushToken').where('breakingNewsAlerts', true);
  console.log(allDevices);

  // Initialize a new Expo SDK client with the provided access token
  const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

  // Extract the Expo push tokens from the devices
  const somePushTokens: string[] = allDevices.map((device) => device.expoPushToken);

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
      body: "Breaking News: " + req.body.title,
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
    if (ticket && 'id' in ticket) {
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
          let { status, message, details } = receipts[receiptId];
          if (status === 'ok') {
            continue;
          } else if (status === 'error') {
            console.error(
              `There was an error sending a notification: ${message}`
            );
            if (details && 'error' in details) {
              console.error(`The error code is ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
  res
    .status(200)
    .json({ message: "The notifications have been scheduled!" });
}

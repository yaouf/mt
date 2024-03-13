import type { NextApiRequest, NextApiResponse } from "next";
import { Expo, ExpoPushMessage, ExpoPushTicket } from "expo-server-sdk";
import db from "../../../db/data/db-config";

type ResponseData = {
    message: string;
};

export default async function breakingHandler(
    req: NextApiRequest, 
    res: NextApiResponse<ResponseData>
) {
    // Ensure that the request type is for breaking news alerts
    if (!req.body.tags || !req.body.tags.includes("breaking")) {
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
                    let { status, details } = receipts[receiptId];
                    if (status === 'ok') {
                        continue;
                    } else if (status === 'error') {
                        console.error(
                            `There was an error sending a notification:`
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
        .json({ message: "The notifications have been scheduled." });
}

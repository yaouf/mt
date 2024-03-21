import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import notificationQueue from "../../queue/queue";
import { ResponseData } from "../../types/types";
import { Notification } from "../../types/types";

export default async function addNotification(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Assuming the request body contains the notification data
    const { time, title, body, tags } = req.body as Notification;

    // Validate required fields
    if (!time || !title || !body || !tags) {
      return res.status(400).json({ message: "Invalid notification data." });
    }

    // Insert the notification data into the "notifications" table
    await db("notifications").insert({
      time,
      title,
      body,
    });

    const dateTime = new Date(time);

    const milliseconds = dateTime.getTime() - Date.now();

    console.log(milliseconds);

    await notificationQueue.add(
      { time, title, body, tags },
      { delay: milliseconds }
    );

    const notifications = await db("notifications").select("*");
    const scheduledNotifications = await notificationQueue.getDelayed();
    console.log(scheduledNotifications);
    res.status(200).json({
      message: "The notification has been added to the database.",
    });
  } catch (error) {
    console.error("Error adding notification to the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import notificationQueue from "../../queue/queue";
import { Notification } from "../../types/types";

type ResponseData = {
  message: string;
  jobId?: number;
};

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
    const insertedRows = await db("notifications")
      .insert({
        time,
        title,
        body,
      })
      .returning("id");

    const jobId = insertedRows[0].id as number;
    

    // prolly dont need this
    if (!jobId) {
      return res.status(400).json({ message: "Invalid notification data." });
    }

    const dateTime = new Date(time);

    const milliseconds = dateTime.getTime() - Date.now();

    console.log("milliseconds", milliseconds);

    // Add the notification to the queue
    const job = await notificationQueue.add(
      { time, title, body, tags },
      { delay: milliseconds, jobId: jobId.toString() }
    );
    console.log("job", job);

    const notifications = await db("notifications").select("*");
    console.log(notifications);
    const scheduledNotifications = await notificationQueue.getDelayed();
    console.log(scheduledNotifications);
    res.status(200).json({ message: "Job successfully added", jobId: jobId });
  } catch (error) {
    console.error("Error adding notification to the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

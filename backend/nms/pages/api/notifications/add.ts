import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import notificationQueue from "../../queue/queue";
import { Notification } from "../../types/types";

type ResponseData = {
  message?: string;
  jobId?: number;
  notifications?: Notification[];
} | Notification[];

export default async function addNotification(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Assuming the request body contains the notification data
    const { time, title, body, tags } = req.body as Notification;
    const slug = req.body.data.slug;

    // Validate required fields
    if (!time || !title || !tags) {
      return res.status(400).json({ message: "Invalid notification data." });
    }

    // Create boolean variables for tags
    console.log("tags", tags);
    const breakingNews = tags.includes("Breaking News");
    const weeklySummary = tags.includes("Weekly Summary");
    const dailySummary = tags.includes("Daily Summary");

    // Insert the notification data into the "notifications" table
    const insertedRows = await db("notifications")
      .insert({
        "time": time,
        "title": title,
        "body": body,
        "slug": slug,
        "Breaking News": breakingNews,
        "Weekly Summary": weeklySummary,
        "Daily Summary": dailySummary,
        "status": "pending",
      })
      .returning("id");

    // Get the ID of the inserted notification
    const jobId = insertedRows[0].id as number;
    
    // Validate the jobId
    if (!jobId) {
      return res.status(400).json({ message: "Invalid notification data." });
    }

    // Calculate the delay in milliseconds
    const dateTime = new Date(time);
    const milliseconds = dateTime.getTime() - Date.now();
    console.log("milliseconds", milliseconds);

    // Add the notification to the queue
    const job = await notificationQueue.add(
      { jobId, time, title, body, tags, slug },
      { delay: milliseconds, jobId: jobId.toString() }
    );
    // console.log("job", job);

    const notifications = await db("notifications").select("*") as Notification[];
    // const scheduledNotifications = await notificationQueue.getDelayed();
    // console.log(scheduledNotifications);
    console.log(notifications);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error adding notification to the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }

  
}

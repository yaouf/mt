import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import notificationQueue from "../../queue/queue";
// import { Notification } from "../../types/types";

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
    // if a string, parse it
    let data: any;
    if (typeof req.body === "string") {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }
    // const data = req.body;
    // console.log("data", JSON.parse(data));
    // TODO: validate this automatically
    // Extract the notification data
    const time = data.time;
    const title = data.title;
    const body = data.body;
    const tags = data.tags;
    const slug = data.slug;
    const mediaType = data.mediaType;
    const publicationDate = data.publicationDate;
    const domain = data.domain;

    // Validate required fields
    if (!time || !title || !tags || !slug || !mediaType || !publicationDate || !domain) {
      // find which field is missing
      console.log(time)
      return res.status(400).json({ message: "Missing fields." });
    }

    // Create boolean variables for tags
    console.log("tags in add.ts", tags);
    const breakingNews = tags.includes("Breaking News");
    const universityNews = tags.includes("University News");
    const metro = tags.includes("Metro");

    // Create url from slug, mediaType, and publicationDate
    const url = `${domain}/${mediaType}/${publicationDate}/${slug}`;
    console.log("url", url);
    // Insert the notification data into the "notifications" table
    const insertedRows = await db("notifications")
      .insert({
        time: time,
        title: title,
        body: body,
        "Breaking News": breakingNews,
        "University News": universityNews,
        "Metro": metro,
        url: url,
        status: "pending",
      })
      .returning("id");
      console.log("insertedRows", insertedRows);
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
      { jobId, time, title, body, tags, url },
      { delay: milliseconds, jobId: jobId.toString() }
    );
    // console.log("job", job);

    // const scheduledNotifications = await notificationQueue.getDelayed();
    // console.log(scheduledNotifications);

    const notifications = await db("notifications").select("*");
    console.log(notifications);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error adding notification to the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import { notificationQueue } from "../queue/queue";
import { Author, Notification, NotificationId, ResponseData } from "../types/types";

export default async function getNotification(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Notification[]>
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

    // TODO: validate this automatically
    // Extract the notification data
    const time = data.time;
    const title = data.title;
    const body = data.body;
    const tags = data.tags;
    const url = data.url;
    const isUid = data.isUid;
    const authorIds = data.authorIds || []; // Optional array of author IDs

    // Validate required fields
    if (!time || !title || !tags || !url) {
      return res.status(400).json({ message: "Missing fields." });
    }

    // Create boolean variables for tags
    console.log("tags in add.ts", tags);
    const breakingNews = tags.includes("Breaking News");
    const universityNews = tags.includes("University News");
    const metro = tags.includes("Metro");
    const sports = tags.includes("Sports");
    const artsAndCulture = tags.includes("Arts and Culture");
    const scienceAndResearch = tags.includes("Science and Research");
    const opinion = tags.includes("Opinions");

    console.log("url", url);
    console.log("isUid", isUid);
    
    // Start a transaction to ensure all related operations succeed or fail together
    const trx = await db.transaction();

    try {
      // Insert the notification data into the "notifications" table
      const insertedRows = await trx("notifications")
        .insert({
          time: time,
          title: title,
          body: body,
          "Breaking News": breakingNews,
          "University News": universityNews,
          "Metro": metro,
          "Sports": sports,
          "Arts and Culture": artsAndCulture,
          "Science and Research": scienceAndResearch,
          "Opinions": opinion,
          url: url,
          isUid: isUid,
          status: "pending",
        })
        .returning("id");
      
      console.log("insertedRows", insertedRows);
      
      // Get the ID of the inserted notification
      const jobId = insertedRows[0].id as number;
      console.log("jobId", jobId);

      // Validate the jobId
      if (!jobId) {
        await trx.rollback();
        return res.status(400).json({ message: "Invalid notification data." });
      }

      // If author IDs are provided, create the author associations
      let authors: Author[] = [];
      if (authorIds && authorIds.length > 0) {
        // Verify all authors exist
        const existingAuthors = await trx("authors")
          .whereIn("id", authorIds)
          .select("id", "name", "slug");
        
        if (existingAuthors.length !== authorIds.length) {
          await trx.rollback();
          return res.status(400).json({ message: "One or more specified authors do not exist." });
        }
        
        // Create the notification-author relationships
        const notificationAuthors = authorIds.map(authorId => ({
          notificationId: jobId,
          authorId,
          dateCreated: new Date().toISOString()
        }));
        
        await trx("notification_authors").insert(notificationAuthors);
        authors = existingAuthors;
      }

      // Calculate the delay in milliseconds
      const dateTime = new Date(time);
      console.log("current time", Date.now(), "scheduled time", dateTime.getTime());
      const milliseconds = dateTime.getTime() - Date.now();
      console.log("milliseconds", milliseconds);

      // Add the notification to the queue with author information
      const _job = await notificationQueue.add("notification",
        { jobId, time, title, body, tags, url, isUid, authors },
        { delay: milliseconds, jobId: jobId.toString() + "_n" }
      );

      // Commit the transaction
      await trx.commit();

      // Query for all notifications including the new one
      const notifications = await db("notifications")
        .select("id", "time", "title", "body", "status", "Breaking News", "University News", 
                "Metro", "Sports", "Arts and Culture", "Science and Research", "Opinions", 
                "url", "isUid");
      
      // If we have author info, include it in the response
      if (authors.length > 0) {
        const result = notifications.map(notification => {
          if (notification.id === jobId) {
            return {
              ...notification,
              authors,
            };
          }
          return notification;
        });
        return res.status(200).json(result);
      }
      
      console.log("notifications in db after adding", notifications);
      res.status(200).json(notifications);
    } catch (error) {
      // If there's an error, roll back the transaction
      await trx.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error adding notification to the queue:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

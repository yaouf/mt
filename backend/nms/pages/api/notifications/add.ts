import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import { notificationQueue } from "../queue/queue";
import { Notification, NotificationId, ResponseData } from "../types/types";

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
    const authorIds = data.authorIds || [];

    // Validate required fields
    if (!time || !title || !tags || !url) {
      // Determine which field is missing
      console.log("Missing fields:", { time, title, tags, url });
      return res.status(400).json({ message: "Missing fields." });
    }

    // Insert the notification into the notifications table
    const [notificationIdObject] = (await db("notifications")
      .insert({
        time,
        title,
        body,
        url,
        is_uid: isUid,
        status: "pending",
      })
      .returning("id")) as NotificationId[];

    console.log("Inserted notification ID:", notificationIdObject.id);

    // Map tags to category IDs
    const categories = await db("categories")
      .whereIn("name", tags)
      .select("id", "name");

    if (categories.length !== tags.length) {
      const missingTags = tags.filter(
        (tag: string) =>
          !categories.find((category: any) => category.name === tag)
      );
      console.log("Missing categories:", missingTags);
      return res
        .status(400)
        .json({ message: `Invalid tags: ${missingTags.join(", ")}` });
    }

    const notificationCategories = categories.map((category) => ({
      notification_id: notificationIdObject.id,
      category_id: category.id,
    }));

    // Insert category relationships into notification_categories
    await db("notification_categories").insert(notificationCategories);

    // Add author relationships if any authors are specified
    let validAuthors = [];
    if (authorIds && authorIds.length > 0) {
      // Verify each author exists
      validAuthors = await db("authors").whereIn("id", authorIds).select("id");

      if (validAuthors.length !== authorIds.length) {
        const missingAuthors = authorIds.filter(
          (id: number) => !validAuthors.find((author: any) => author.id === id)
        );
        console.log("Missing authors:", missingAuthors);
        // Continue with valid authors only
      }

      // Create relationships for valid authors
      const notificationAuthors = validAuthors.map((author) => ({
        notificationId: notificationIdObject.id,
        authorId: author.id,
      }));

      if (notificationAuthors.length > 0) {
        await db("notification_authors").insert(notificationAuthors);
      }
    }

    // Schedule the notification using the queue
    const dateTime = new Date(time);
    const delay = dateTime.getTime() - Date.now();

    await notificationQueue.add(
      "notification",
      {
        notificationId: notificationIdObject.id,
        time,
        title,
        body,
        tags,
        url,
        isUid,
        authorIds: validAuthors ? validAuthors.map((author) => author.id) : [],
      },
      { delay, jobId: `${notificationIdObject.id}_n` }
    );

    // Fetch all notifications with their categories and authors
    const notifications = await db("notifications as n")
      .leftJoin("notification_categories as nc", "n.id", "nc.notification_id")
      .leftJoin("categories as c", "nc.category_id", "c.id")
      .leftJoin("notification_authors as na", "n.id", "na.notificationId")
      .leftJoin("authors as a", "na.authorId", "a.id")
      .select(
        "n.id",
        "n.time",
        "n.title",
        "n.body",
        "n.status",
        "n.url",
        "n.is_uid",
        db.raw("STRING_AGG(DISTINCT c.name, ',') AS categories"),
        db.raw("STRING_AGG(DISTINCT a.name, ',') AS authors"),
        db.raw("STRING_AGG(DISTINCT CAST(a.id AS TEXT), ',') AS author_ids")
      )
      .groupBy(
        "n.id",
        "n.time",
        "n.title",
        "n.body",
        "n.status",
        "n.url",
        "n.is_uid"
      )
      .orderBy("n.time", "desc");

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error adding notification to the queue:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

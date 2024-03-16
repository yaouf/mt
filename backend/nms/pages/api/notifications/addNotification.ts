import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

type ResponseData = {
    message: string;
};

type Notification = {
    time: string;
    title: string;
    body: string;
};

export default async function addNotification(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Assuming the request body contains the notification data
    const { time, title, body } = req.body as Notification;

    // Validate required fields
    if (!time || !title || !body) {
      return res.status(400).json({ message: "Invalid notification data." });
    }

    // Insert the notification data into the "notifications" table
    await db("notifications").insert({
      time,
      title,
      body,
    });

    res.status(200).json({
      message: "The notification has been added to the database.",
    });
  } catch (error) {
    console.error("Error adding notification to the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

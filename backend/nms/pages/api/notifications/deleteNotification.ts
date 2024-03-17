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

export default async function deleteNotification(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Assuming the request body contains the notification data
    console.log(req.body);
    const { time, title, body } = req.body as Notification;

    // Validate required fields
    if (!time || !title || !body) {
      return res.status(400).json({ message: "Invalid notification data." });
    }

    // Delete the notification from the "notifications" table
    const deletedCount = await db("notifications")
      .where({ time, title, body })
      .del();

    if (deletedCount > 0) {
      const notifications = await db("notifications").select("*");
      res.status(200).json(notifications);
    } else {
      res.status(404).json({
        message: "Notification not found in the database.",
      });
    }
  } catch (error) {
    console.error("Error deleting notification from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

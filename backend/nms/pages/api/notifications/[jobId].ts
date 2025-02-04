import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../db/data/db-config";
import {authMiddleware} from "../../../middleware/authMiddleware";
import corsMiddleware from "../../../config/cors";

type ResponseData = {
  message: string;
};

type Notification = {
  time: string;
  title: string;
  body: string;
};

async function getNotificationHelper(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>,
) {
  try {
    // get path param
    console.log("query", req.query);
    // Get the jobId from the query string
    const jobId = parseInt(req.query.jobId as string);
    if(isNaN(jobId)) {
      return res
        .status(404)
        .json({
          message:
            "Invalid jobId. Please provide a valid jobId like so: /api/notifications/1",
        });
    }

    if (jobId) {
      const notification = await db("notifications")
        .select("id", "time", "title", "body", "status", "Breaking News", "University News", "Metro", "Sports", "Arts and Culture", "Science and Research", "Opinions", "url", "isUid")
        .where({ id: jobId });
      if (notification.length === 0) {
        return res.status(404).json({ message: "Notification not found." });
      } 
      res.status(200).json(notification[0]);
    } else {
      // TODO: is this being reached, given we have index.ts?
      // Sorts in reverse chronological order
      const notifications = await db("notifications").select("id", "time", "title", "body", "status", "Breaking News", "University News", "Metro", "Sports", "Arts and Culture", "Science and Research", "Opinions", "url", "isUid").orderBy("time", "desc");
      res.status(200).json(notifications);
    }
  } catch (error) {
    console.error("Error fetching notifications from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
export default async function getNotification(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>,
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, getNotificationHelper);
  });
}
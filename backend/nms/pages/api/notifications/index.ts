import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import corsMiddleware from "../../../config/cors";
import { authMiddleware } from "../../../middleware/authMiddleware";
type ResponseData = {
  message: string;
};

async function getNotificationsHelper(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>,
) {
  try {
    // Sorts in reverse chronological order
    const notifications = await db("notifications").select("id", "time", "title", "body", "status", "Breaking News", "University News", "Metro", "Sports", "Arts and Culture", "Science and Research", "Opinions","url", "isUid").orderBy("time", "desc");
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
export default async function getNotifications(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>,
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, getNotificationsHelper);
  });

}
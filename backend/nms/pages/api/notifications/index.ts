import { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware from "../../../config/cors";
import db from "../../../dist/data/db-config";
import { authMiddleware } from "../../../middleware/authMiddleware";
type ResponseData = {
  message: string;
};

type Notification = {
  id: number;
  time: string;
  title: string;
  body: string;
  status: string;
  url: string;
  is_uid: boolean;
  categories: string;
  authors?: string;
  author_ids?: string;
};

async function getNotificationsHelper(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>
) {
  try {
    // Fetch notifications with their associated categories and authors
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
    console.error("Error fetching notifications from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
export default async function getNotifications(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, getNotificationsHelper);
  });
}

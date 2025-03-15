import { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware from "../../../config/cors";
import db from "../../../dist/data/db-config";
import { authMiddleware } from "../../../middleware/authMiddleware";

type ResponseData = {
  message: string;
};

type Notification = {
  time: string;
  title: string;
  body: string;
  tags?: string[];
  categories?: string;
  status?: string;
  url?: string;
  is_uid?: boolean;
  authors?: string;
  author_ids?: string;
  authorIds?: number[];
};

async function getNotificationHelper(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Notification[]>
) {
  try {
    console.log("query", req.query);

    // Get the jobId from the query string
    const jobId = parseInt(req.query.jobId as string);

    if (!isNaN(jobId)) {
      // Fetch single notification with categories and authors
      const notificationWithCategories = await db("notifications as n")
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
        .where("n.id", jobId)
        .groupBy(
          "n.id",
          "n.time",
          "n.title",
          "n.body",
          "n.status",
          "n.url",
          "n.is_uid"
        )
        .first();

      if (!notificationWithCategories) {
        return res.status(404).json({ message: "Notification not found." });
      }

      // Convert author_ids to an array of numbers
      const authorIds = notificationWithCategories.author_ids 
        ? notificationWithCategories.author_ids.split(',').map(id => parseInt(id, 10))
        : [];
      
      res.status(200).json({
        ...notificationWithCategories,
        tags: notificationWithCategories.categories ? notificationWithCategories.categories.split(',') : [],
        authorIds
      });
    } else {
      // Fetch all notifications with categories and authors
      const notificationsWithCategories = await db("notifications as n")
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

      res.status(200).json(
        notificationsWithCategories.map((notification) => {
          // Convert author_ids to an array of numbers for each notification
          const authorIds = notification.author_ids 
            ? notification.author_ids.split(',').map(id => parseInt(id, 10))
            : [];
            
          return {
            ...notification,
            tags: notification.categories ? notification.categories.split(',') : [],
            authorIds
          };
        })
      );
    }
  } catch (error) {
    console.error("Error fetching notifications from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
export default async function getNotification(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, getNotificationHelper);
  });
}

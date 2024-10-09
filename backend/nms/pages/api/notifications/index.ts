import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

type ResponseData = {
  message: string;
};

export default async function getNotifications(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>,
) {
  try {
//     SELECT n.id, n.title, STRING_AGG(nt.name, ', ') AS notification_types
// FROM notifications n
// JOIN subscriptions s ON s.notification_type_id = n.id -- Adjust this as needed
// JOIN notification_types nt ON nt.id = s.notification_type_id
// GROUP BY n.id, n.title;

    const notifications = await db("notifications")
      .select("id", "time", "title", "body", "status", "Breaking News", "University News", "Metro", "url", "isUid")
      .join("subscriptions", "notifications.id", "subscriptions.notification_type_id")
      .join("notification_types", "subscriptions.notification_type_id", "notification_types.id")
      .groupBy("notifications.id", "notifications.title");
    console.log("notifications", notifications);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

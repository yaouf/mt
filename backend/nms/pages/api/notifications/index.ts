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
    const notifications = await db("notifications").select("id", "time", "title", "body", "status", "Breaking News", "University News", "Metro", "Sports", "Arts and Culture", "Science and Research", "Opinions", "url", "isUid");
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

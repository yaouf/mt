import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

type ResponseData = {
  message: string;
};

type Notification = {
  id: number;
  time: string;
  title: string;
  body: string | null;
  breakingNews: boolean;
  weeklySummary: boolean;
  dailySummary: boolean;
  pathname: string | null;
  status: string;
};

export default async function getScheduledNotifications(
  _req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>
) {
  try {
    // Fetch notifications with status 'pending'
    const notifications = await db("notifications")
      .select("*")
      .where({ status: "pending" });
      
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications from the database:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}

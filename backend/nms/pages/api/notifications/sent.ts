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

export default async function getRecentSentNotifications(
  _req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>
) {
  try {
    // Get the date one month ago from today
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1))
      .toISOString()
      .split("T")[0];

    // Fetch notifications sent within the last month with status 'sent'
    const notifications = await db("notifications")
      .select("*")
      .where("time", ">=", oneMonthAgo)
      .andWhere("status", "sent");

    return res.status(200).json(notifications);
  } catch (error) {
    console.error(
      "Error fetching recent sent notifications from the database:",
      error
    );
    return res.status(500).json({ message: "Internal server error." });
  }
}

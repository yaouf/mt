import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

type ResponseData = {
  message: string;
};

type Notification = {
  time: string;
  title: string;
  body: string;
};

export default async function getNotification(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>
) {
  try {
    // Get the jobId from the query string
    const jobId = parseInt(req.query.jobId as string);

    if (jobId) {
      const notification = await db("notifications")
        .select("*")
        .where({ id: jobId });
      res.status(200).json(notification[0]);
    } else {
      const notifications = await db("notifications").select("*");
      res.status(200).json(notifications);
    }
  } catch (error) {
    console.error("Error fetching notifications from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

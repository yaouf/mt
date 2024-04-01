import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import notificationQueue from "../../queue/queue";

type ResponseData = {
  message: string;
};

type RequestData = {
  jobId: number;
};

export default async function deleteNotification(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Assuming the request body contains the notification data
    console.log(req.body);
    const { jobId } = req.body as RequestData;
    // Validate required fields
    if (!jobId) {
      return res.status(400).json({ message: "Invalid notification data." });
    }

    const job = await notificationQueue.getJob(jobId.toString());
    if (!job) {
      return res
        .status(404)
        .json({ message: "Notification not found in queue." });
    }
    await job.remove();

    // Delete the notification from the "notifications" table
    const deletedCount = await db("notifications").where({ id: jobId }).del();

    if (deletedCount > 0) {
      const notifications = await db("notifications").select("*");
      console.log(notifications);
      res.status(200).json({ message: "Notification successfully deleted." });
    } else {
      res.status(404).json({
        message: "Notification not found in database.",
      });
    }
  } catch (error) {
    console.error("Error deleting notification from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

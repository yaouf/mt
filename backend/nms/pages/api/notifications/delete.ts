import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import notificationQueue from "../queue/queue";
import { firewall } from "./firewall";

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
    await firewall(req, res);
  } catch (error) {
    // If firewall check fails, return 403 Forbidden
    return res.status(403).json({ message: 'Access denied' });
  }
  
  try {
    // Assuming the request body contains the notification data
    // if a string, parse it
    let data: any;
    if (typeof req.body === "string") {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }
    const { jobId } = data as RequestData;

    // Validate required fields
    if (!jobId) {
      return res.status(400).json({ message: "Invalid notification data." });
    }

    // Delete the notification from the job queue
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
      res.status(200).json(notifications);
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

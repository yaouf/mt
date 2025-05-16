import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../dist/data/db-config';
import { notificationQueue } from '../queue/queue';
import { Notification, RequestData, ResponseData } from '../types/types';
import corsMiddleware from '../../../config/cors';
import { authMiddleware } from '../../../middleware/authMiddleware';

/**
 * Helper function to handle notification deletion logic.
 *
 * @param req - API request containing the job ID in the body.
 * @param res - API response returning updated notifications or an error message.
 */
async function deleteNotificationHelper(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Notification[]>
) {
  try {
    // Parse the request body
    const data: RequestData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { jobId } = data;

    // Validate required fields
    if (!jobId) {
      return res.status(400).json({ message: 'Invalid notification data.' });
    }

    // Remove the job from the notification queue
    const job = await notificationQueue.getJob(`${jobId}_n`);
    if (job) {
      console.log('Job deleted from queue.');
      await job.remove();
    } else {
      console.warn(`Could not find job in queue with ID: ${jobId}_n`);
    }

    // Delete the notification from the database
    const deletedCount = await db('notifications').where({ id: jobId }).del();

    if (deletedCount > 0) {
      // Fetch all notifications with their categories
      const notifications = await db('notifications as n')
        .leftJoin('notification_categories as nc', 'n.id', 'nc.notification_id')
        .leftJoin('categories as c', 'nc.category_id', 'c.id')
        .select(
          'n.id',
          'n.time',
          'n.title',
          'n.body',
          'n.status',
          'n.url',
          'n.is_uid',
          db.raw("STRING_AGG(c.name, ',') AS categories")
        )
        .groupBy('n.id', 'n.time', 'n.title', 'n.body', 'n.status', 'n.url', 'n.is_uid')
        .orderBy('n.time', 'desc');

      console.log('Notifications in database after deletion:', notifications);
      res.status(200).json(notifications);
    } else {
      res.status(404).json({ message: 'Notification not found in database.' });
    }
  } catch (error) {
    console.error('Error deleting notification from the database:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

/**
 * API route handler for deleting a scheduled notification.
 *
 * @param req - The incoming HTTP request.
 * @param res - The HTTP response that returns updated notifications or an error.
 *
 * @remarks
 * - Expects a JSON body containing the `jobId`.
 * - Deletes the corresponding job from the notification queue and the database.
 * - Returns updated list of notifications with their categories.
 */
export default async function deleteNotification(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Notification[]>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, deleteNotificationHelper);
  });
}


// import type { NextApiRequest, NextApiResponse } from "next";
// import db from "../../../dist/data/db-config";
// import { notificationQueue } from "../queue/queue";

// type ResponseData = {
//   message: string;
// };

// type RequestData = {
//   jobId: number;
// };

// export default async function deleteNotification(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   try {
//     // Assuming the request body contains the notification data
//     // if a string, parse it
//     let data: any;
//     if (typeof req.body === "string") {
//       data = JSON.parse(req.body);
//     } else {
//       data = req.body;
//     }
//     const { jobId } = data as RequestData;

//     // Validate required fields
//     if (!jobId) {
//       return res.status(400).json({ message: "Invalid notification data." });
//     }

//     // Delete the notification from the job queue
//     const job = await notificationQueue.getJob(jobId.toString() + "_n");
//     if (job) {
//       console.log("Job deleted from queue. ");
//       await job.remove();
//     } else {
//       console.warn(
//         "could not find job in queue with id: ",
//         jobId.toString() + "_n"
//       );
//     }

//     // Delete the notification from the "notifications" table
//     const deletedCount = await db("notifications").where({ id: jobId }).del();

//     if (deletedCount > 0) {
//       const notifications = await db("notifications").select(
//         "id",
//         "time",
//         "title",
//         "body",
//         "status",
//         "Breaking News",
//         "University News",
//         "Metro",
//         "Sports",
//         "Arts and Culture",
//         "Science and Research",
//         "Opinions",
//         "url",
//         "isUid"
//       );
//       console.log(notifications);
//       res.status(200).json(notifications);
//     } else {
//       res.status(404).json({
//         message: "Notification not found in database.",
//       });
//     }
//   } catch (error) {
//     console.error("Error deleting notification from the database:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// }

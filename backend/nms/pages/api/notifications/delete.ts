import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import { notificationQueue } from "../queue/queue";

type RequestData = {
  jobId: number;
};

type Notification = {
  id: number;
  time: string;
  title: string;
  body: string;
  url: string;
  status: string;
  is_uid: boolean;
  categories?: string[];
};

type ResponseData = {
  message: string;
};

export default async function getNotification(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Notification[]>
) {
  try {
    // Parse the request body
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
    const job = await notificationQueue.getJob(jobId.toString() + "_n");
    if (job) {
      console.log("Job deleted from queue.");
      await job.remove();
    } else {
      console.warn(
        "Could not find job in queue with id:",
        jobId.toString() + "_n"
      );
    }

    // Delete the notification from the "notifications" table
    const deletedCount = await db("notifications").where({ id: jobId }).del();

    if (deletedCount > 0) {
      // Fetch all notifications with their categories after deletion
      const notifications = await db("notifications as n")
        .leftJoin("notification_categories as nc", "n.id", "nc.notification_id")
        .leftJoin("categories as c", "nc.category_id", "c.id")
        .select(
          "n.id",
          "n.time",
          "n.title",
          "n.body",
          "n.status",
          "n.url",
          "n.is_uid",
          db.raw("ARRAY_AGG(c.name) FILTER (WHERE c.name IS NOT NULL) AS categories")
        )
        .groupBy("n.id")
        .orderBy("n.time", "desc");

      console.log("Notifications in database after deletion:", notifications);

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

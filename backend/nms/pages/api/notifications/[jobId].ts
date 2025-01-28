import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

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
    console.log("query", req.query);

    // Get the jobId from the query string
    const jobId = parseInt(req.query.jobId as string);

    if (!isNaN(jobId)) {
      // Fetch single notification with categories
      const notificationWithCategories = await db("notifications as n")
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
        .where("n.id", jobId)
        .groupBy("n.id")
        .first();

      if (!notificationWithCategories) {
        return res.status(404).json({ message: "Notification not found." });
      }

      res.status(200).json({
        ...notificationWithCategories,
        tags: notificationWithCategories.categories || [],
      });
    } else {
      // Fetch all notifications with categories
      const notificationsWithCategories = await db("notifications as n")
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

      res.status(200).json(
        notificationsWithCategories.map((notification) => ({
          ...notification,
          tags: notification.categories || [],
        }))
      );
    }
  } catch (error) {
    console.error("Error fetching notifications from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

// import { NextApiRequest, NextApiResponse } from "next";
// import db from "../../../dist/data/db-config";

// type ResponseData = {
//   message: string;
// };

// type Notification = {
//   time: string;
//   title: string;
//   body: string;
// };

// export default async function getNotification(
//   req: NextApiRequest,
//   res: NextApiResponse<Notification[] | ResponseData>
// ) {
//   try {
//     // get path param
//     console.log("query", req.query);
//     // Get the jobId from the query string
//     const jobId = parseInt(req.query.jobId as string);
//     if (isNaN(jobId)) {
//       return res.status(404).json({
//         message:
//           "Invalid jobId. Please provide a valid jobId like so: /api/notifications/1",
//       });
//     }

//     if (jobId) {
//       const notification = await db("notifications")
//         .select(
//           "id",
//           "time",
//           "title",
//           "body",
//           "status",
//           "Breaking News",
//           "University News",
//           "Metro",
//           "Sports",
//           "Arts and Culture",
//           "Science and Research",
//           "Opinions",
//           "url",
//           "isUid"
//         )
//         .where({ id: jobId });
//       if (notification.length === 0) {
//         return res.status(404).json({ message: "Notification not found." });
//       }
//       res.status(200).json(notification[0]);
//     } else {
//       // TODO: is this being reached, given we have index.ts?
//       // Sorts in reverse chronological order
//       const notifications = await db("notifications")
//         .select(
//           "id",
//           "time",
//           "title",
//           "body",
//           "status",
//           "Breaking News",
//           "University News",
//           "Metro",
//           "Sports",
//           "Arts and Culture",
//           "Science and Research",
//           "Opinions",
//           "url",
//           "isUid"
//         )
//         .orderBy("time", "desc");
//       res.status(200).json(notifications);
//     }
//   } catch (error) {
//     console.error("Error fetching notifications from the database:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// }

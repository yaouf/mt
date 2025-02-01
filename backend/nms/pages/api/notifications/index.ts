import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import { Notification, ResponseData } from "../types/types";

export default async function getNotifications(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseData | Notification[]>
) {
  try {
    // Fetch notifications with their associated categories
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

    res.status(200).json(notifications);
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

// export default async function getNotifications(
//   req: NextApiRequest,
//   res: NextApiResponse<Notification[] | ResponseData>
// ) {
//   try {
//     // Sorts in reverse chronological order
//     const notifications = await db("notifications")
//       .select(
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
//       )
//       .orderBy("time", "desc");
//     res.status(200).json(notifications);
//   } catch (error) {
//     console.error("Error fetching notifications from the database:", error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// }

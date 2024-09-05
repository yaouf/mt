import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import protectedHandler from "../protected";

type ResponseData = {
  message: string;
};

export default async function getNotifications(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>,
) {
  protectedHandler(req, res);
  try {
    const notifications = await db("notifications").select("*");
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

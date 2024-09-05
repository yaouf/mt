import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import { firewall } from "./firewall";

type ResponseData = {
  message: string;
};

export default async function getNotifications(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>,
) {
  try {
    await firewall(req, res);
  } catch (error) {
    // If firewall check fails, return 403 Forbidden
    return res.status(403).json({ message: 'Access denied' });
  }
  
  try {
    const notifications = await db("notifications").select("*");
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

type ResponseData = {
  message: string;
};

export default async function getNotifications(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>,
) {
  try {
    const picks = await db("editorspicks").select("url");
    res.status(200).json(picks);
  } catch (error) {
    console.error("Error fetching editor's picks from the database:", error);
    res.status(500).json({ message: error.message });
  }
}

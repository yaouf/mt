import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

type ResponseData = {
  count?: string;
  message?: string;
};

export default async function getBreakingNotifications(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const result = await db("devices").count("*").where("Breaking News", true);
    console.log("result", result);
    const { count } = result[0];
    console.log("breaking news enabled devices", count);

    res.status(200).json({ count });
  } catch (error) {
    console.error(
      "Error fetching device count for breaking news from the database:",
      error
    );
    res.status(500).json({ message: error.message });
  }
}

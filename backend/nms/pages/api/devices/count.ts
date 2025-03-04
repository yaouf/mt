import { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware from "../../../config/cors";
import db from "../../../dist/data/db-config";
import { authMiddleware } from "../../../middleware/authMiddleware";

type ResponseData = {
  count?: string;
  message?: string;
};

async function getDeviceCountHelper(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const search = req.query.search ? (req.query.search as string) : "";
    let result;

    if (search !== "") {
      if (search === "isPushEnabled") {
        // Use the custom logic for push enabled count
        result = await db("devices")
          .count("* as count")
          .where((builder) => {
            builder
              .where("Breaking News", true)
              .orWhere("University News", true)
              .orWhere("Metro", true)
              .orWhere("Sports", true)
              .orWhere("Arts and Culture", true)
              .orWhere("Science and Research", true)
              .orWhere("Opinions", true);
          });
      } else {
        // For other search queries, use the standard where clause
        result = await db("devices").count("* as count").where(search, true);
      }
    } else {
      // When no search query is provided, count all devices
      result = await db("devices").count("* as count");
    }

    const { count } = result[0];
    console.log("count", count);

    res.status(200).json({ count });
  } catch (error: any) {
    console.error("Error fetching device count from the database:", error);
    res.status(500).json({ message: error.message });
  }
}

export default async function getDeviceCount(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, getDeviceCountHelper);
  });
}

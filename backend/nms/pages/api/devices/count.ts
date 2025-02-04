import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../db/data/db-config";
import corsMiddleware from "../../../config/cors";
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
    if (search!="") {
      result = await db("devices").count("* as count").where(search,true);
    } else {
      result = await db("devices").count("* as count");
    }

    const { count } = result[0];
    console.log("count", count);

    res.status(200).json({ count });
  } catch (error) {
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
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

type ResponseData = {
  message?: string;
  devices?: any[]; // Adjust type as per your device structure
};

export default async function getDevices(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const index = req.query.page ? parseInt(req.query.page as string, 10) : 0;
    const devicesPerPage = req.query.perPage
      ? parseInt(req.query.perPage as string, 10)
      : 1;
    const offset = index * devicesPerPage;

    const devices = await db("devices")
      .select("*")
      .orderBy("expoPushToken", "asc")
      .offset(offset)
      .limit(devicesPerPage)
      .where(true); 
    res.status(200).json(devices);
  } catch (error) {
    console.error("Error fetching devices from the database:", error);
    res.status(500).json({ message: error.message });
  }
}

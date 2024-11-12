import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

type ResponseData = {
  message?: string;
  devices?: any[]; // Adjust type as per your device structure
  totalDevices?: string;
};

export default async function getDevices(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const search = req.query.search ? req.query.search as string : "";
    const index = req.query.page ? parseInt(req.query.page as string, 10) : 0;
    const devicesPerPage = req.query.perPage ? parseInt(req.query.perPage as string, 10) : 1; 
    const offset = index * devicesPerPage; 

    let query = await db("devices")
      .select("*")
      .orderBy("expoPushToken", "asc")

      if (search) {
        query.where("expoPushToken", "like", `%${search}%`);
      }
    const totalDevices = await query.clone().count("* as count").first();
    query=query.offset(offset).limit(devicesPerPage);
    const devices = await query
    res.status(200).json({ totalDevices, devices });
  } catch (error) {
    console.error("Error fetching devices from the database:", error);
    res.status(500).json({ message: error.message });
  }
}
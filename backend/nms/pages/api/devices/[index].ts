import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

type ResponseData = {
  message?: string;
  devices?: any[]; // Adjust type as per your device structure
  totalDevices?: number;
};

export default async function getDevices(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const search = req.query.search ? (req.query.search as string) : "";
    const index = req.query.page ? parseInt(req.query.page as string, 10) : 0;
    const devicesPerPage = req.query.perPage ? parseInt(req.query.perPage as string, 10) : 1; 
    const offset = index * devicesPerPage; 

    // Count query to get the total number of devices matching the search term
    const totalDevicesResult = await db("devices")
      .modify((queryBuilder) => {
        if (search) {
          queryBuilder.where("expoPushToken", "like", `%${search}%`);
        }
      })
      .count("* as count")
      .first();
    const totalDevices = totalDevicesResult ? parseInt(totalDevicesResult.count, 10) : 0;

    // Main query for pagination and search filtering
    const devices = await db("devices")
      .select("*")
      .orderBy("expoPushToken", "asc")
      .modify((queryBuilder) => {
        if (search) {
          queryBuilder.where("expoPushToken", "like", `%${search}%`);
        }
      })
      .offset(offset)
      .limit(devicesPerPage)
      .where(true);

    res.status(200).json({ totalDevices, devices });
  } catch (error) {
    console.error("Error fetching devices from the database:", error);
    res.status(500).json({ message: error.message });
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

type ResponseData = {
  count?: string;
  message?: string;
};

export default async function getUniversityNewsDevices(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const result = await db("devices")
      .count("* as count")
      .join("device_preferences", "devices.id", "device_preferences.device_id")
      .join("categories", "device_preferences.category_id", "categories.id")
      .where("categories.name", "University News")
      .andWhere("devices.is_push_enabled", true);
    // const result = await db("devices")
    //   .count("* as count")
    //   .where("University News", true);

    const { count } = result[0];
    // console.log("university news enabled devices", count);

    res.status(200).json({ count });
  } catch (error) {
    console.error(
      "Error fetching device count for university news from the database:",
      error
    );
    res.status(500).json({ message: error.message });
  }
}

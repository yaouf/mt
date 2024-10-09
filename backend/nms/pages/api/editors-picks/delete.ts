import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

type ResponseData = {
  message?: string;
};

export default async function deleteEditorPick(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    let data: any;
    if (typeof req.body === "string") {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }

    const url = data.url;

    console.log("url", url);

    // Delete the pick from the table
    const deletedCount = await db("editorspicks").where({ url: url }).del();

    if (deletedCount > 0) {
      const editorspicks = await db("editorspicks").select("*");
      console.log("picks", editorspicks);
      res.status(200).json(editorspicks);
    } else {
      res.status(404).json({
        message: "Editor pick not found in database.",
      });
    }
  } catch (error) {
    console.error("Error deleting editors pick from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

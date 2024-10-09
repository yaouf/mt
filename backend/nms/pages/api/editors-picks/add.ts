import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";

type ResponseData =
  | {
      message?: string;
      jobId?: number;
      picks?: EditorPick[];
    }
  | EditorPick
  | EditorPick[];

interface EditorPick {
  id: number;
  url: string;
}
export default async function addEditorPick(
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
    // Insert the notification data into the table
    const insertedRows = await db("editorspicks")
      .insert({
        url: url,
      })
      .returning("id");
    console.log("insertedRows", insertedRows);

    // Create a new editor's pick
    const newPick: EditorPick = {
      id: Date.now(), // Unique ID for the new pick
      url: url,
    };

    // Respond with the new pick
    res.status(201).json(newPick);
    
  } catch (error) {
    console.error("Error deleting editors pick from the database:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

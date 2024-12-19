import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import { EditorPick } from "../types/types";

type ResponseData =
  | {
      message?: string;
      picks?: EditorPick[];
    }
  | EditorPick
  | EditorPick[];

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

    // Get the current highest rank
    const maxRankResult = await db("editorspicks")
      .max("rank as maxRank")
      .first();
    const newRank = (maxRankResult?.maxRank || 0) + 1;

    // Insert the editor's pick data into the table
    const insertedRows = await db("editorspicks")
      .insert({
        url: url,
        rank: newRank,
      })
      .returning(["url", "rank"]);

    // Create a new editor's pick
    const newPick: EditorPick = {
      url: url,
      rank: newRank,
    };

    res.status(201).json(newPick);
  } catch (error) {
    console.error("Error adding editors pick to the database:", error);
    res.status(500).json({ message: error.message });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import { EditorPick } from "../types/types";
import { authMiddleware } from "../../../middleware/authMiddleware";
import corsMiddleware from "../../../config/cors";

type ResponseData =
  | {
      message?: string;
      picks?: EditorPick[];
    }
  | EditorPick
  | EditorPick[];

async function addEditorPickHelper(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | EditorPick>
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
    const maxRankResult = await db("editors_picks")
      .max("rank as maxRank")
      .first();
    const intMaxRank = parseInt(maxRankResult?.maxRank);
    const newRank = (intMaxRank || 0) + 1;

    // Insert the editor's pick data into the table
    const insertedRows = await db("editors_picks")
      .insert({
        url: url,
        rank: newRank,
      })
      .returning(["id", "url", "rank"]);

    // Create a new editor's pick
    const newPick: EditorPick = insertedRows[0];

    res.status(201).json(newPick);
  } catch (error) {
    console.error("Error adding editors pick to the database:", error);
    res.status(500).json({ message: error.message });
  }
}

export default async function addEditorPick(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, addEditorPickHelper);
  });
}

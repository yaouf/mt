import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../db/data/db-config";
import { EditorPick } from "../types/types";
import { authMiddleware } from "../../../middleware/authMiddleware";
import corsMiddleware from "../../../config/cors";

type ResponseData = {
  message: string;
};

async function getEditorsPicksHelper(
  req: NextApiRequest,
  res: NextApiResponse<EditorPick[] | ResponseData>
) {
  try {
    const picks = await db("editorspicks")
      .select("url", "rank")
      .orderBy("rank", "asc");
    res.status(200).json(picks);
  } catch (error) {
    console.error("Error fetching editor's picks from the database:", error);
    res.status(500).json({ message: error.message });
  }
}

export default async function getEditorsPicks(
  req: NextApiRequest,
  res: NextApiResponse<EditorPick[] | ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, getEditorsPicksHelper);
  });
}
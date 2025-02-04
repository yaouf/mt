import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../db/data/db-config";
import { EditorPick } from "../types/types";

type ResponseData = {
  message: string;
};

export default async function getEditorsPicks(
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

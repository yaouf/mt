import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../dist/data/db-config";
import { EditorPick } from "../types/types";

type ResponseData = {
  message?: string;
  picks?: EditorPick[];
};

export default async function updateEditorPickRanks(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const picks: EditorPick[] = req.body;

    // Update ranks in transaction to ensure consistency
    await db.transaction(async (trx) => {
      for (const pick of picks) {
        await trx("editorspicks")
          .where({ url: pick.url })
          .update({ rank: pick.rank });
      }
    });

    res.status(200).json({ picks });
  } catch (error) {
    console.error("Error updating editor pick ranks:", error);
    res.status(500).json({ message: error.message });
  }
} 
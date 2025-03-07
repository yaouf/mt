import type { NextApiRequest, NextApiResponse } from "next";
import corsMiddleware from "../../../config/cors";
import db from "../../../dist/data/db-config";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { EditorPick } from "../types/types";

type ResponseData = {
  message?: string;
  picks?: EditorPick[];
};

async function updateEditorPickRanksHelper(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | EditorPick[]>
) {
  try {
    const picks: EditorPick[] = req.body;

    // Update ranks in transaction to ensure consistency
    await db.transaction(async (trx) => {
      for (const pick of picks) {
        await trx("editors_picks")
          .where({ url: pick.url })
          .update({ rank: pick.rank });
      }
    });

    res.status(200).json(picks);
  } catch (error) {
    console.error("Error updating editor pick ranks:", error);
    res.status(500).json({ message: error.message });
  }
}

export default async function updateEditorPickRanks(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, updateEditorPickRanksHelper);
  });
}

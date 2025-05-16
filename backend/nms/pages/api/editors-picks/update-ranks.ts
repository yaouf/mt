import type { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../config/cors';
import db from '../../../dist/data/db-config';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { EditorPick } from '../types/types';

type ResponseData = {
  message?: string;
  picks?: EditorPick[];
};

/**
 * Updates the rank values of a list of editor picks.
 *
 * @param req - The incoming Next.js API request object containing an array of `EditorPick` objects.
 * @param res - The API response object used to return the updated picks or an error.
 *
 * @remarks
 * - Uses a database transaction to ensure all rank updates are applied atomically.
 * - Expects `req.body` to be an array of editor picks with updated ranks.
 *
 * @returns A 200 response with the updated picks, or a 500 response with an error message.
 */
async function updateEditorPickRanksHelper(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | EditorPick[]>
) {
  try {
    const picks: EditorPick[] = req.body;

    // Update ranks in transaction to ensure consistency
    await db.transaction(async (trx) => {
      for (const pick of picks) {
        await trx('editors_picks').where({ url: pick.url }).update({ rank: pick.rank });
      }
    });

    res.status(200).json(picks);
  } catch (error) {
    console.error('Error updating editor pick ranks:', error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * API route handler for updating ranks of editor picks.
 * Applies CORS and authentication middleware before processing the rank updates.
 *
 * @param req - The API request object from Next.js.
 * @param res - The API response object to send the result or error.
 *
 * @returns Executes `updateEditorPickRanksHelper` after CORS and auth middleware.
 */
export default async function updateEditorPickRanks(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, updateEditorPickRanksHelper);
  });
}

import { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../config/cors';
import db from '../../../dist/data/db-config';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { EditorPick } from '../types/types';

type ResponseData = {
  message: string;
};

/**
 * Retrieves all editor picks from the database ordered by rank.
 *
 * @param req - The incoming Next.js API request object.
 * @param res - The Next.js API response object used to return the list of picks or an error message.
 *
 * @remarks
 * - Fetches all records from the `editors_picks` table.
 * - Results are ordered by the `rank` field in ascending order.
 *
 * @returns A JSON array of `EditorPick` objects or an error message.
 */
async function getEditorsPicksHelper(
  req: NextApiRequest,
  res: NextApiResponse<EditorPick[] | ResponseData>
) {
  try {
    const picks = await db('editors_picks').select('url', 'rank').orderBy('rank', 'asc');
    res.status(200).json(picks);
  } catch (error) {
    console.error("Error fetching editor's picks from the database:", error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * API route handler for retrieving editor picks.
 * Applies CORS and authentication middleware before querying the database.
 *
 * @param req - The Next.js API request object.
 * @param res - The Next.js API response object.
 *
 * @returns Executes `getEditorsPicksHelper` after CORS and authentication validation.
 */
export default async function getEditorsPicks(
  req: NextApiRequest,
  res: NextApiResponse<EditorPick[] | ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, getEditorsPicksHelper);
  });
}

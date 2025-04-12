import type { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../config/cors';
import db from '../../../dist/data/db-config';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { EditorPick } from '../types/types';

type ResponseData =
  | {
      message?: string;
      picks?: EditorPick[];
    }
  | EditorPick
  | EditorPick[];

/**
 * Inserts a new editor's pick into the `editors_picks` table.
 * Automatically assigns a rank based on the current maximum rank in the table.
 *
 * @param req - The incoming Next.js API request object.
 * @param res - The Next.js API response object used to return the created pick or an error.
 *
 * @remarks
 * - Expects a JSON body with a `url` field representing the pick.
 * - Parses the body if sent as a string.
 * - Ranks are incremented based on the highest existing rank.
 *
 * @returns A JSON object representing the newly created `EditorPick`, or an error message.
 */
async function addEditorPickHelper(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | EditorPick>
) {
  try {
    let data: any;
    if (typeof req.body === 'string') {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }

    const url = data.url;

    // Get the current highest rank
    const maxRankResult = await db('editors_picks').max('rank as maxRank').first();
    const intMaxRank = parseInt(maxRankResult?.maxRank);
    const newRank = (intMaxRank || 0) + 1;

    // Insert the editor's pick data into the table
    const insertedRows = await db('editors_picks')
      .insert({
        url: url,
        rank: newRank,
      })
      .returning(['id', 'url', 'rank']);

    // Create a new editor's pick
    const newPick: EditorPick = insertedRows[0];

    res.status(201).json(newPick);
  } catch (error) {
    console.error('Error adding editors pick to the database:', error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * API route handler for adding a new editor's pick.
 * Applies CORS middleware and authentication before executing the insertion logic.
 *
 * @param req - The incoming API request object from Next.js.
 * @param res - The API response object used to return the result.
 *
 * @returns Executes the addEditorPickHelper after passing CORS and authentication.
 */
export default async function addEditorPick(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, addEditorPickHelper);
  });
}

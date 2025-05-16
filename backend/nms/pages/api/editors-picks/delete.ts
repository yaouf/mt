import type { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../config/cors';
import db from '../../../dist/data/db-config';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { EditorPick } from '../types/types';

type ResponseData = {
  message?: string;
  editorspicks?: { url: string }[];
};

/**
 * Deletes an editor's pick from the `editors_picks` table based on the provided URL.
 *
 * @param req - The incoming Next.js API request object.
 * @param res - The Next.js API response object used to return the updated picks or an error.
 *
 * @remarks
 * - Expects a JSON body with a `url` field identifying the pick to delete.
 * - If the URL is found, the pick is deleted and the remaining picks are returned.
 * - If not found, returns a 404 with an error message.
 *
 * @returns A list of remaining editor picks, or an error response.
 */
async function deleteEditorPickHelper(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | EditorPick[]>
) {
  try {
    let data: any;
    if (typeof req.body === 'string') {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }

    const url = data.url;

    console.log('url', url);

    // Delete the pick from the table
    const deletedCount = await db('editors_picks').where({ url: url }).del();

    if (deletedCount > 0) {
      const editorsPicks = await db('editors_picks').select('url');
      console.log('picks', editorsPicks);
      res.status(200).json({ editorspicks: editorsPicks });
    } else {
      res.status(404).json({
        message: 'Editor pick not found in database.',
      });
    }
  } catch (error) {
    console.error('Error deleting editors pick from the database:', error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * API route handler for deleting an editor's pick by URL.
 * Applies CORS and authentication middleware before proceeding to deletion logic.
 *
 * @param req - The API request object from Next.js.
 * @param res - The API response object used to return the result.
 *
 * @returns Executes the deleteEditorPickHelper after CORS and authentication.
 */
export default async function deleteEditorPick(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, deleteEditorPickHelper);
  });
}

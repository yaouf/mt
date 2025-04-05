import type { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../config/cors';
import db from '../../../dist/data/db-config';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { EditorPick } from '../types/types';

type ResponseData = {
  message?: string;
  editorspicks?: { url: string }[];
};

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

export default async function deleteEditorPick(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, deleteEditorPickHelper);
  });
}

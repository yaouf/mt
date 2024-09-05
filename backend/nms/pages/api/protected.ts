import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyIdToken } from './firebase';
import { ResponseData } from './types/types';

export default async function protectedHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await verifyIdToken(token);
    // You can access user information via decodedToken
    return res.status(200).json({ message: 'Authorized'});
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

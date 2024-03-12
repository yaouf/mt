import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../db/data/db-config';

type ResponseData = {
    message: string;
};

type Notification = {
  time: string;
  title: string;
  body: string;
};

export default async function getNotifications(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>
) {
  try {
    const notifications = await db('notifications').select('*');
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications from the database:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

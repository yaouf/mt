import { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../config/cors';
import db from '../../../dist/data/db-config';
import { authMiddleware } from '../../../middleware/authMiddleware';

/**
 * Response data structure for the API endpoints.
 */
type ResponseData = {
  message: string;
};

/**
 * Notification data structure.
 */
type Notification = {
  id: number;
  time: string;
  title: string;
  body: string;
  status: string;
  url: string;
  is_uid: boolean;
  categories: string;
};

/**
 * Helper function to fetch notifications along with their associated categories from the database.
 * It retrieves notifications and aggregates their categories into a comma-separated string.
 *
 * @param req - The incoming API request object.
 * @param res - The outgoing API response object.
 * 
 * @returns A list of notifications with associated categories, or an error message if something goes wrong.
 */
async function getNotificationsHelper(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>
) {
  try {
    // Fetch notifications with their associated categories
    const notifications = await db('notifications as n')
      .leftJoin('notification_categories as nc', 'n.id', 'nc.notification_id')
      .leftJoin('categories as c', 'nc.category_id', 'c.id')
      .select(
        'n.id',
        'n.time',
        'n.title',
        'n.body',
        'n.status',
        'n.url',
        'n.is_uid',
        db.raw("STRING_AGG(c.name, ',') AS categories")
      )
      .groupBy('n.id', 'n.time', 'n.title', 'n.body', 'n.status', 'n.url', 'n.is_uid')
      .orderBy('n.time', 'desc');

    // Respond with the fetched notifications
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications from the database:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

/**
 * API route to fetch notifications and their associated categories.
 * This function uses middlewares for CORS and authentication before executing the helper function.
 * 
 * @param req - The incoming API request object.
 * @param res - The outgoing API response object.
 * 
 * @returns A list of notifications with categories or an error message in case of failure.
 */
export default async function getNotifications(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>
) {
  // Apply CORS and authentication middleware before executing the helper function
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, getNotificationsHelper);
  });
}

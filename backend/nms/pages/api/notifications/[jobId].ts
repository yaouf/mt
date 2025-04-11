import { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../config/cors';
import db from '../../../dist/data/db-config';
import { authMiddleware } from '../../../middleware/authMiddleware';

type ResponseData = {
  message: string;
};

type Notification = {
  time: string;
  title: string;
  body: string;
  tags?: string[];
  categories?: string;
  status?: string;
  url?: string;
  is_uid?: boolean;
};

/**
 * Retrieves notifications from the database.
 *
 * @param req - The API request object. Accepts a `jobId` query parameter to fetch a specific notification.
 * @param res - The API response object that returns either a list of notifications, a single notification, or an error message.
 *
 * @remarks
 * - If `jobId` is provided, the API will return a single notification with its associated categories.
 * - If `jobId` is not provided, all notifications will be returned, ordered by time (descending).
 * - Categories are aggregated as comma-separated strings and returned as `tags` in the response.
 *
 * @returns A JSON response with either a list of notifications, a single notification, or an error message.
 */
async function getNotificationHelper(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Notification[]>
) {
  try {
    console.log('query', req.query);

    // Get the jobId from the query string
    const jobId = parseInt(req.query.jobId as string);

    if (!isNaN(jobId)) {
      // Fetch single notification with categories
      const notificationWithCategories = await db('notifications as n')
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
        .where('n.id', jobId)
        .groupBy('n.id', 'n.time', 'n.title', 'n.body', 'n.status', 'n.url', 'n.is_uid')
        .first();

      if (!notificationWithCategories) {
        return res.status(404).json({ message: 'Notification not found.' });
      }

      res.status(200).json({
        ...notificationWithCategories,
        tags: notificationWithCategories.categories || [],
      });
    } else {
      // Fetch all notifications with categories
      const notificationsWithCategories = await db('notifications as n')
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

      res.status(200).json(
        notificationsWithCategories.map((notification) => ({
          ...notification,
          tags: notification.categories || [],
        }))
      );
    }
  } catch (error) {
    console.error('Error fetching notifications from the database:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

/**
 * API route handler for fetching notifications.
 * Applies CORS and authentication middleware before retrieving notification data.
 *
 * @param req - The API request object.
 * @param res - The API response object.
 *
 * @returns Executes `getNotificationHelper` after applying CORS and authentication.
 */
export default async function getNotification(
  req: NextApiRequest,
  res: NextApiResponse<Notification[] | ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, getNotificationHelper);
  });
}

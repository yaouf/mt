import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../dist/data/db-config';
import { notificationQueue } from '../queue/queue';
import { Notification, NotificationId, ResponseData } from '../types/types';

/**
 * API route handler to add a new notification and schedule it in the notification queue.
 *
 * @param req - The API request object containing notification details in the request body.
 * @param res - The API response object returning all notifications or an error message.
 *
 * @remarks
 * - Required fields: `time`, `title`, `tags`, and `url`.
 * - Tags must match existing categories in the `categories` table.
 * - Notification is inserted into the `notifications` table with status `'pending'`.
 * - A job is added to the `notificationQueue` to schedule sending based on the `time`.
 * - Response includes all notifications with their categories.
 */
export default async function getNotification(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData | Notification[]>
) {
  try {
    // Parse JSON body if it's a string
    let data: any;
    if (typeof req.body === 'string') {
      data = JSON.parse(req.body);
    } else {
      data = req.body;
    }

    // Extract the notification data
    const time = data.time;
    const title = data.title;
    const body = data.body;
    const tags = data.tags;
    const url = data.url;
    const isUid = data.isUid;

    // Validate required fields
    if (!time || !title || !tags || !url) {
      console.log('Missing fields:', { time, title, tags, url });
      return res.status(400).json({ message: 'Missing fields.' });
    }

    // Insert the notification into the notifications table
    const [notificationIdObject] = (await db('notifications')
      .insert({
        time,
        title,
        body,
        url,
        is_uid: isUid,
        status: 'pending',
      })
      .returning('id')) as NotificationId[];

    console.log('Inserted notification ID:', notificationIdObject.id);

    // Map tags to category IDs
    const categories = await db('categories').whereIn('name', tags).select('id', 'name');

    if (categories.length !== tags.length) {
      const missingTags = tags.filter(
        (tag: string) => !categories.find((category: any) => category.name === tag)
      );
      console.log('Missing categories:', missingTags);
      return res.status(400).json({ message: `Invalid tags: ${missingTags.join(', ')}` });
    }

    // Insert category relationships into notification_categories
    const notificationCategories = categories.map((category) => ({
      notification_id: notificationIdObject.id,
      category_id: category.id,
    }));
    await db('notification_categories').insert(notificationCategories);

    // Schedule the notification using the queue
    const dateTime = new Date(time);
    const delay = dateTime.getTime() - Date.now();

    await notificationQueue.add(
      'notification',
      {
        notificationId: notificationIdObject.id,
        time,
        title,
        body,
        tags,
        url,
        isUid,
      },
      { delay, jobId: `${notificationIdObject.id}_n` }
    );

    // Fetch all notifications with their categories
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

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error adding notification to the queue:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

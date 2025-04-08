import { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../config/cors';
import db from '../../../dist/data/db-config';
import { authMiddleware } from '../../../middleware/authMiddleware';

type ResponseData = {
  count?: string;
  message?: string;
};

async function getDeviceCountHelper(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const search = req.query.search ? (req.query.search as string) : '';
    let result;

    if (search !== '') {
      if (search === 'isPushEnabled') {
        // Count all devices that have at least one category enabled and push notifications enabled
        // This combines both approaches - using the new schema with device_preferences
        result = await db('devices')
          .countDistinct('devices.id as count')
          .join('device_preferences', 'devices.id', 'device_preferences.device_id')
          .where('devices.is_push_enabled', true);
      } else if (search.includes('is_push_enabled')) {
        // Direct query for push enabled status
        result = await db('devices').count('* as count').where('is_push_enabled', true);
      } else {
        // For category-specific search queries
        const categoryName = search.replace(/"/g, ''); // Remove quotes if present

        result = await db('devices')
          .countDistinct('devices.id as count')
          .join('device_preferences', 'devices.id', 'device_preferences.device_id')
          .join('categories', 'device_preferences.category_id', 'categories.id')
          .where('categories.name', categoryName)
          .andWhere('devices.is_push_enabled', true);
      }
    } else {
      // When no search query is provided, count all devices
      result = await db('devices').count('* as count');
    }

    // Always use the count value from the database result
    const count = result[0]?.count || 0;
    console.log('count', count);

    res.status(200).json({ count });
  } catch (error: any) {
    console.error('Error fetching device count from the database:', error);
    res.status(500).json({ message: error.message });
  }
}

export default async function getDeviceCount(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, getDeviceCountHelper);
  });
}

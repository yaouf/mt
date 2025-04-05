import { NextApiRequest, NextApiResponse } from 'next';
import corsMiddleware from '../../../config/cors';
import db from '../../../dist/data/db-config';
import { authMiddleware } from '../../../middleware/authMiddleware';

type ResponseData = {
  message?: string;
  devices?: any[]; // Adjust type as per your device structure
  totalDevices?: number;
};

async function getDevicesHelper(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const search = req.query.search ? (req.query.search as string) : '';
    const index = req.query.page ? parseInt(req.query.page as string, 10) : 0;
    const devicesPerPage = req.query.perPage ? parseInt(req.query.perPage as string, 10) : 1;
    const offset = index * devicesPerPage;

    // Count query to get the total number of devices matching the search term
    const totalDevicesResult = await db('devices')
      .modify((queryBuilder) => {
        if (search) {
          queryBuilder.where('expo_push_token', 'like', `%${search}%`);
        }
      })
      .count('* as count')
      .first();
    const totalDevices = totalDevicesResult ? parseInt(totalDevicesResult.count, 10) : 0;

    // Main query for pagination and search filtering
    const devices = await db('devices')
      .leftJoin('device_preferences', 'devices.id', 'device_preferences.device_id')
      .leftJoin('categories', 'device_preferences.category_id', 'categories.id')
      .select(
        'devices.id',
        'devices.expo_push_token',
        'devices.device_type',
        db.raw('devices.date_created as date_created'),
        'devices.is_push_enabled',
        db.raw("STRING_AGG(categories.name, ',') as categories")
      )
      .groupBy(
        'devices.id',
        'devices.expo_push_token',
        'devices.device_type',
        'devices.is_push_enabled',
        'devices.date_created'
      )
      .orderBy('expo_push_token', 'asc')
      .modify((queryBuilder) => {
        if (search) {
          queryBuilder.where('expo_push_token', 'like', `%${search}%`);
        }
      })
      .offset(offset)
      .limit(devicesPerPage);

    res.status(200).json({ totalDevices, devices });
  } catch (error) {
    console.error('Error fetching devices from the database:', error);
    res.status(500).json({ message: error.message });
  }
}

export default async function getDevices(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  corsMiddleware(req, res, async () => {
    await authMiddleware(req, res, getDevicesHelper);
  });
}

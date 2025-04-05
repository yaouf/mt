import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

// Seed the database with test data using the normalized schema
export async function seed(knex: Knex): Promise<void> {
  // Clear all tables first
  await knex('device_preferences').truncate();
  await knex('notification_categories').truncate();
  await knex('devices').truncate();
  await knex('notifications').truncate();
  await knex('editors_picks').truncate();
  // Don't truncate the categories table as it's meant to be static

  // Create devices with updated schema (using snake_case field names)
  const device1Id = uuidv4();
  const device2Id = uuidv4();
  const device3Id = uuidv4();

  // Insert devices
  await knex('devices').insert([
    {
      id: device1Id,
      device_type: 'ios',
      expo_push_token: 'ExponentPushToken[psEoIvGQmUy-WCOX2LVqq5]',
      is_push_enabled: true,
    },
    {
      id: device2Id,
      device_type: 'ios',
      expo_push_token: 'ExponentPushToken[mGGu2cGvMo9QjWr2QlsH9a]',
      is_push_enabled: true,
    },
    {
      id: device3Id,
      device_type: 'ios',
      expo_push_token: 'ExponentPushToken[IIDil0LpnR0mZj4irAdv_x]',
      is_push_enabled: true,
    },
  ]);

  // Get the category IDs (assumed to already exist from migrations)
  const categories = await knex('categories').select('id', 'name');
  const categoryMap: Record<string, number> = {};

  for (const category of categories) {
    categoryMap[category.name] = category.id;
  }

  // Set device preferences for the "Breaking News" category
  if (categoryMap['Breaking News']) {
    await knex('device_preferences').insert([
      { device_id: device1Id, category_id: categoryMap['Breaking News'] },
      { device_id: device2Id, category_id: categoryMap['Breaking News'] },
      { device_id: device3Id, category_id: categoryMap['Breaking News'] },
    ]);
  }

  // Insert a test notification
  const [notification] = await knex('notifications')
    .insert({
      time: '2025-01-01T00:00:00.000Z',
      title: 'Test Notification 1',
      body: 'This is a test notification.',
      url: 'https://www.browndailyherald.com/article/2024/10/underground-coffee-co-receives-10-violations-after-health-inspection',
      status: 'pending',
      is_uid: false,
    })
    .returning('id');

  // Set the notification category to "Breaking News"
  if (notification && categoryMap['Breaking News']) {
    await knex('notification_categories').insert({
      notification_id: notification.id,
      category_id: categoryMap['Breaking News'],
    });
  }
}

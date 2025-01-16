import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Clear all existing data
  await knex("editors_picks").truncate();
  await knex("notification_categories").truncate();
  await knex("notifications").truncate();
  await knex("device_preferences").truncate();
  await knex("devices").truncate();
  await knex("users").truncate();
  await knex("categories").truncate();

  // Insert mock categories
  const categories = await knex("categories")
    .insert([
      { name: "Breaking News" },
      { name: "University News" },
      { name: "Metro" },
      { name: "Sports" },
      { name: "Arts and Culture" },
      { name: "Science and Research" },
      { name: "Opinions" },
    ])
    .returning("*");

  // Insert mock devices
  const devices = await knex("devices")
    .insert([
      {
        id: uuidv4(),
        device_type: "ios",
        expo_push_token: "ExponentPushToken[FXK5ltGxeudjBlsp_e4dLP]",
        is_push_enabled: true,
        date_created: new Date().toISOString(),
      },
    ])
    .returning("*");

  // Insert mock notifications
  const notifications = await knex("notifications")
    .insert([
      {
        time: new Date().toISOString(),
        title: "Test Notification 1",
        body: "This is a test notification.",
        url: "https://www.browndailyherald.com/article/2024/10/underground-coffee-co-receives-10-violations-after-health-inspection",
        status: "pending",
        is_uid: false,
      },
    ])
    .returning("*");

  // Map notifications to categories (notification_categories table)
  await knex("notification_categories").insert([
    { notification_id: notifications[0].id, category_id: categories[0].name }, // Breaking News
    { notification_id: notifications[0].id, category_id: categories[1].name }, // University News
  ]);

  // Insert editor's picks
  await knex("editors_picks").insert([
    {
      url: "https://www.example.com/editor1",
      rank: 1,
    },
    {
      url: "https://www.example.com/editor2",
      rank: 2,
    },
  ]);

  console.log("Database seeded successfully!");
}

// import { Knex } from "knex";
// import { v4 as uuidv4 } from 'uuid';

// // TODO: rename this file to 001.ts
// export async function seed(knex: Knex): Promise<void> {
//   // Deletes ALL existing entries
//   await knex("devices").truncate();

//   // Inserts seed entries
//   // TODO: change column names to camelCase
//   await knex("devices").insert([
//     {
//       id: uuidv4(),
//       deviceType: "ios",
//       "Breaking News": true,
//       "University News": false,
//       "Metro": false,
//       "Sports": false,
//       "Arts and Culture": false,
//       "Science and Research": false,
//       "Opinions": false,
//       expoPushToken: "ExponentPushToken[psEoIvGQmUy-WCOX2LVqq5]",
//       isPushEnabled: true,
//     },
//     {
//       id: uuidv4(),
//       deviceType: "ios",
//       "Breaking News": true,
//       "University News": false,
//       "Metro": false,
//       "Sports": false,
//       "Arts and Culture": false,
//       "Science and Research": false,
//       "Opinions": false,
//       expoPushToken: "ExponentPushToken[mGGu2cGvMo9QjWr2QlsH9a]",
//       isPushEnabled: true,
//     },
//     {
//       id: uuidv4(),
//       deviceType: "ios",
//       "Breaking News": true,
//       "University News": false,
//       "Metro": false,
//       "Sports": false,
//       "Arts and Culture": false,
//       "Science and Research": false,
//       "Opinions": false,
//       expoPushToken: "ExponentPushToken[IIDil0LpnR0mZj4irAdv_x]",
//       isPushEnabled: true,
//     },
//   ]);

//   await knex("notifications").truncate();

//   await knex("editorspicks").truncate();

//   // TODO: Uncomment this once tests work with preexisting notifications
//   await knex("notifications").insert([
//     {
//       time: "2025-01-01T00:00:00.000Z",
//       title: "Test Notification 1",
//       body: "This is a test notification.",
//       "Breaking News": true,
//       "University News": false,
//       "Metro": false,
//       "Sports": false,
//       "Arts and Culture": false,
//       "Science and Research": false,
//       "Opinions": false,
//       url: "https://www.browndailyherald.com/article/2024/10/underground-coffee-co-receives-10-violations-after-health-inspection",
//       status: "pending",
//       "isUid": false,
//     }]);

// }

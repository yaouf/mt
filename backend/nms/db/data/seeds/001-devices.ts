import { Knex } from "knex";
import { v4 as uuidv4 } from 'uuid';

// TODO: rename this file to 001.ts
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("devices").del();

  // Inserts seed entries
  await knex("devices").insert([
    {
      id: uuidv4(),
      deviceType: "ios",
      "Breaking News": true,
      "University News": false,
      "Metro": false,
      expoPushToken: "ExponentPushToken[psEoIvGQmUy-WCOX2LVqq5]",
      isPushEnabled: true,
    },
    {
      id: uuidv4(),
      deviceType: "ios",
      "Breaking News": true,
      "University News": false,
      "Metro": false,
      expoPushToken: "ExponentPushToken[mGGu2cGvMo9QjWr2QlsH9a]",
      isPushEnabled: true,
    },
    {
      id: uuidv4(),
      deviceType: "ios",
      "Breaking News": true,
      "University News": false,
      "Metro": false,
      expoPushToken: "ExponentPushToken[IIDil0LpnR0mZj4irAdv_x]",
      isPushEnabled: true,
    },
  ]);

  await knex("notifications").del();

  await knex("editorspicks").del();

  // TODO: Uncomment this once tests work with preexisting notifications
  await knex("notifications").insert([
    {
      time: "2025-01-01T00:00:00.000Z",
      title: "Test Notification 1",
      body: "This is a test notification.",
      "Breaking News": true,
      "University News": false,
      "Metro": false,
      url: "https://www.browndailyherald.com/article/2024/10/underground-coffee-co-receives-10-violations-after-health-inspection",
      status: "pending",
      "isUid": false,
    }]);

}

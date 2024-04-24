import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("devices").del();

  // Inserts seed entries
  await knex("devices").insert([
    {
      id: uuidv4(),
      deviceType: "iOS",
      "Breaking News": true,
      "Weekly Summary": false,
      "Daily Summary": false,
      expoPushToken: "ExponentPushToken[psEoIvGQmUy-WCOX2LVqq5]",
    },
    {
      id: uuidv4(),
      deviceType: "iOS",
      "Breaking News": true,
      "Weekly Summary": false,
      "Daily Summary": false,
      expoPushToken: "ExponentPushToken[mGGu2cGvMo9QjWr2QlsH9a]",
    },
  ]);
}

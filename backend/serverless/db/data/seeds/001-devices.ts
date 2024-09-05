import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

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
      expoPushToken: "ExponentPushToken[98FnGADJ4AOEqyomeGRsRR]",
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
  ]);
}

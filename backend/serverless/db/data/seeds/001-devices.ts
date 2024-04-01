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
      breakingNewsAlerts: true,
      weeklySummaryAlerts: false,
      expoPushToken: "ExponentPushToken[98FnGADJ4AOEqyomeGRsRR]",
    },
  ]);
}

import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("devices").del();

  // Inserts seed entries
  await knex("devices").insert([
    {
      deviceType: "iOS",
      breakingNewsAlerts: true,
      weeklySummaryAlerts: false,
      expoPushToken: "ExpoToken[123]",
    }
  ]);
}

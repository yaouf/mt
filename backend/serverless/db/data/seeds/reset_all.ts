import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  console.log("Resetting all tables");

  // First delete from junction tables to avoid foreign key constraints
  await knex("device_preferences").truncate();
  await knex("notification_categories").truncate();
  
  // Then delete from main tables
  await knex("devices").truncate();
  await knex("notifications").truncate();
  await knex("editors_picks").truncate();
}

import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  console.log("Resetting all tables...");

  // Disable foreign key checks (important for databases like MySQL or SQLite)
  // await knex.raw("PRAGMA foreign_keys = OFF"); // For SQLite
  // await knex.raw("SET session_replication_role = 'replica';"); // For PostgreSQL

  // Truncate all tables in the correct order
  await knex("notification_categories").truncate();
  await knex("device_preferences").truncate();
  await knex("editors_picks").truncate();
  await knex("notifications").truncate();
  await knex("devices").truncate();
  await knex("users").truncate();
  await knex("categories").truncate();

  // Re-enable foreign key checks
  // await knex.raw("PRAGMA foreign_keys = ON"); // For SQLite
  // await knex.raw("SET session_replication_role = 'origin';"); // For PostgreSQL

  console.log("All tables reset successfully!");
}

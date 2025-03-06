import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  console.log("Resetting all tables");

  await knex("devices").truncate();

  await knex("notifications").truncate();

  await knex("editorspicks").truncate();

}

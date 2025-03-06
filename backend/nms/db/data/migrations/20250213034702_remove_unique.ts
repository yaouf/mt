import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("editors_picks", (table) => {
    // Remove "editorspicks_rank_unique" since the table used to be called "editorspicks"
    table.dropUnique(["rank"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("editors_picks", (table) => {
    table.unique(["rank"]);
  });
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("editors_picks", (table) => {
    table.dropUnique(["rank"], "editorspicks_rank_unique");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("editors_picks", (table) => {
    table.unique(["rank"], "editorspicks_rank_unique");
  });
}

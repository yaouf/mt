import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("editorspicks", (table) => {
    // Add rank column with no default value and unique constraint
    table.integer("rank").notNullable().defaultTo(999);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("editorspicks", (table) => {
    table.dropColumn("rank");
  });
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Using raw SQL to drop the constraint by its exact name
  return knex.raw(
    "IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'UQ__editorsp__DD778417286DF27B') DROP INDEX UQ__editorsp__DD778417286DF27B ON editors_picks"
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("editors_picks", (table) => {
    table.unique(["rank"]);
  });
}

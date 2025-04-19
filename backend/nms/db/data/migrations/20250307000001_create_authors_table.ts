import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("authors", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("slug").notNullable().unique();
    table.timestamp("dateCreated").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("authors");
}
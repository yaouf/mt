import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("device_author_subscriptions", (table) => {
    table.increments("id").primary();
    table.uuid("deviceId").notNullable().references("id").inTable("devices").onDelete("CASCADE");
    table.integer("authorId").notNullable().references("id").inTable("authors").onDelete("CASCADE");
    table.timestamp("dateCreated").defaultTo(knex.fn.now());
    table.unique(["deviceId", "authorId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("device_author_subscriptions");
}
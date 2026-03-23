import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("notification_authors", (table) => {
    table.increments("id").primary();
    table.integer("notificationId").notNullable().references("id").inTable("notifications").onDelete("CASCADE");
    table.integer("authorId").notNullable().references("id").inTable("authors").onDelete("CASCADE");
    table.timestamp("dateCreated").defaultTo(knex.fn.now());
    table.unique(["notificationId", "authorId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("notification_authors");
}
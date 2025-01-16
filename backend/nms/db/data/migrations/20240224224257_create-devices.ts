import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("categories", (table) => {
    table.increments("id").primary();
    table.string("name").unique().notNullable();
  });

  await knex.schema.createTable("devices", (table) => {
    table.uuid("id").primary();
    table.string("device_type").notNullable();
    table.string("expo_push_token").unique().notNullable();
    table.boolean("is_push_enabled").notNullable();
    table.timestamp("date_created").nullable();
  });

  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table.string("email").unique().notNullable();
    table.string("name").notNullable();
  });

  await knex.schema.createTable("device_preferences", (table) => {
    table.uuid("device_id").references("id").inTable("devices").onDelete("CASCADE").primary();
    table.integer("category_id").references("id").inTable("categories").onDelete("CASCADE").primary();
  });

  await knex.schema.createTable("notifications", (table) => {
    table.increments("id").primary();
    table.string("time").notNullable();
    table.string("title").notNullable();
    table.string("body").nullable();
    table.string("url").nullable();
    table.string("status").notNullable();
    table.boolean("is_uid").notNullable();
  });

  await knex.schema.createTable("notification_categories", (table) => {
    table.integer("notification_id").references("id").inTable("notifications").onDelete("CASCADE").notNullable();
    table.integer("category_id").references("id").inTable("categories").onDelete("CASCADE").notNullable();
    table.primary(["notification_id", "category_id"]);
  });

  await knex.schema.createTable("editors_picks", (table) => {
    table.increments("id").primary();
    table.string("url").unique().notNullable();
    table.integer("rank").notNullable().defaultTo(999);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("editors_picks");
  await knex.schema.dropTableIfExists("notification_categories");
  await knex.schema.dropTableIfExists("notifications");
  await knex.schema.dropTableIfExists("device_preferences");
  await knex.schema.dropTableIfExists("devices");
  await knex.schema.dropTableIfExists("users");
  await knex.schema.dropTableIfExists("categories");
}

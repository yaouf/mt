import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable("notification_types", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
    })
    .then(() =>
      knex.schema.createTable("devices", (table) => {
        table.uuid("id").primary();
        table.string("deviceType").notNullable();
        table.string("expoPushToken").unique().notNullable();
        table.boolean("isPushEnabled").notNullable();
      })
    )
    .then(() =>
      knex.schema.createTable("users", (table) => {
        table.uuid("id").primary();
        table.string("email").unique().notNullable();
        table.string("name").notNullable();
      })
    )
    .then(() =>
      knex.schema.createTable("notifications", (table) => {
        table.increments("id").primary();
        table.string("time").notNullable();
        table.string("title").notNullable();
        table.string("body").nullable();
        table.string("url").nullable();
        table.string("status").notNullable();
        table.boolean("isUid").notNullable();
      })
    ).then(() =>
      knex.schema.createTable("subscriptions", (table) => {
        table.integer("notification_type_id").unsigned().notNullable();
        table.uuid("device_id").notNullable();
        table.foreign("notification_type_id").references("notification_types.id").onDelete("CASCADE");
        table.foreign("device_id").references("devices.id").onDelete("CASCADE");
        table.primary(["notification_type_id", "device_id"]);
      })
    );
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("subscriptions");
  await knex.schema.dropTableIfExists("notifications");
  await knex.schema.dropTableIfExists("notification_types");
  await knex.schema.dropTableIfExists("devices");
  await knex.schema.dropTableIfExists("users");
}
